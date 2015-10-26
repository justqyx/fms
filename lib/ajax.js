'use strict'
var iUtil = require('./util')
var extend = require('extend')
var colors = require('colors')
var controller = require('./controller')
var mime =require('mime')
var config = require('./config').get()
var doc = require('./doc').addDoc
var Handlebars = require('handlebars')
var Mock = require('mockjs')
var _ = require('underscore')
var marked = require('marked')
var hljs = require('highlight.js')
marked.setOptions({
    highlight: function (code, lang, callback) {
        if (lang) {
            return hljs.highlight(lang, code).value
        }
        else {
            return hljs.highlightAuto(code).value
        }
    }
})
var ajaxTpl = Handlebars.compile(Mock.heredoc(config.ajax.docTemplate))
var ajax = function (settings) {
    var handler
    var sContentType

    settings.url = iUtil.checkUrl(settings.url)
    // url 错误时会返回 false
    if (!settings.url){
        return false
    }

    // res 不应该用 extend 而是当不存在时整个替换
    settings.timeout = settings.timeout || config.ajax.timeout
    settings.dataType = settings.dataType || config.ajax.dataType
    settings.type = settings.type || config.ajax.type
    var copyres = extend(true, {}, config.ajax.res)
    extend(true, copyres, settings.res)
    settings.res = copyres

    // 如果某个属性设置为 false 则表示不需要这个状态
    // 我们会在 run(settings) 中配置 ajax 的默认参数
    // 如果某个AJAX只需要 ok 一种状态
    /*
        res: {
            ok: {
                name: 'fms'
            },
            err: false
        }
    */
    _.each(settings.res, function (value, key) {
        if (value === false) {
            delete settings.res[key]
        }
    })
    

    // post => POST , get => GET
    settings.type = settings.type.trim().toUpperCase()

    if (!/^(GET|POST|PUT|DELETE)$/.test(settings.type)) {
        console.log('----------------------------------------'.grey)
        console.log('settings.type: '.red + settings.type + ' Parameter error !'.red)
        console.log('----------------------------------------'.grey)
        throw "settings.type allow only 'get' 'post' 'put' 'delete' !"
    }

    // json ==> application/json , text ==> text/html
    sContentType = mime.lookup(settings.dataType)
    controller.handle(settings.url, 'ajax', settings, function (req, res) {
        iUtil.namespace([req.path, 'ajax'], req.cookies.fms)
        var resType = req.cookies.fms[req.path]['ajax'][settings.type] || 'ok'
        var resBody = settings.res[resType]
        // 控制 AJAX 成功失败的 cookie 值在 res 中找不到时
        if (!resBody) {
            resBody = settings.res[0]
        }
        // 递归将 res.ok res.err 转换为字符串或 function 默认返回的 undefined
        ;(function translateResponse () {
            switch (typeof resBody) {
                case 'string':
                break
                case 'function':
                    resBody = resBody(req, res)
                    // responseResult could be Number Object                    
                    translateResponse()
                break
                case 'object':                
                    resBody = JSON.stringify(resBody)
                break
                case 'number':
                    resBody = String(resBody)
                break
                default:
            }
        })()
        /*
        resBody = function(res, res){
            res.send('message')
        }
        resBody() === undefined
        如果 resBody 是 undefined 则表示已经使用了 res.send 之类方法 响应了请求
        @todo
        文档：当 res.some 是 function 时如果没有 res.send 没有return undefined 以外的值则会一直无响应
        */

        if (resBody !== undefined) {
            
            setTimeout(
                function() {
                    if (settings.dataType === 'jsonp') {
                        res.jsonp(JSON.parse(resBody))
                    } else {
                        res.set({
                            "Content-Type": sContentType
                        })
                        res.send(resBody)
                    }
                },
                settings.timeout
            )
        }
    })
    var docSettings = extend(true, {}, settings)
    _.each(docSettings.res, function (value, key) {
        ;(function translateResponse () {
            switch (typeof value) {
                case 'string':
                break
                case 'function':
                    try {
                        value = value()
                    }
                    catch (err) {
                        value = 'Mock Function'
                    }
                    translateResponse()
                break
                case 'object':                
                    value = iUtil.formatJson(JSON.stringify(value))
                break
                case 'number':
                    value = String(value)
                break
                default:
            }
        })()
        docSettings.res[key] = value
    })
    if (typeof docSettings.request === 'object') {
        docSettings.request = iUtil.formatJson(JSON.stringify(docSettings.request))
    }
    doc('<a href="#' + docSettings.url + '!ajax" class="markdown-anchor" data-url="' + docSettings.url + '"name="' + docSettings.url + '!ajax">#</a>\r\n')

    doc(marked(ajaxTpl(docSettings)))

    var oCallbackHandler = {
        // 兼容老 API
        ok: function (res) {
            settings.res.ok = res
            return this
        },
        // 兼容老 API
        error: function (res) {
            settings.res.ok = res
            return this
        },
        res: function (obj) {
            settings.res = obj
            return this
        },
        // 兼容老 API
        all: function (obj) {
            settings.res = {
                ok: obj
            }
            return this
        }
    }
    return oCallbackHandler
}

function get (settings) {
    settings.type = 'GET'
    return ajax(settings)
}
function post (settings) {
    settings.type = 'POST'
    return ajax(settings)
}
function put (settings) {
    settings.type = 'PUT'
    return ajax(settings)
}
function ajaxdelete (settings) {
    settings.type = 'DELETE'
    return ajax(settings)
}


module.exports = {
    ajax: ajax,
    get: get,
    post: post,
    put: put,
    delete: ajaxdelete
}