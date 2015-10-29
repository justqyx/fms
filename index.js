'use strict'
                                                                        /*
    Docs - 文档         : http://fms.help
    Demo - 示例      : http://demo.fms.help
    Community - 社区    : https://github.com/nimojs/fms/issues
    Github             : https://github.com/nimojs/fms
    Contact - 联系作者  : nimo.jser[at]gmail.com http://weibo.com/nimojs
    Help - 帮助 : https://github.com/nimojs/fms/issues/new
                                                                        */
var ajax = require('./lib/ajax')
var doc = require('./lib/doc')
module.exports = {
    run: require('./lib/init'),
    chance: require('chance'),
    app: null,
    _set: function (name, value) {
        this[name] = value
    },
    ajax: ajax.ajax,
    get: ajax.get,
    post: ajax.post,
    delete: ajax.delete,
    put: ajax.put,
    view: require('./lib/view'),
    doc: doc.addDoc,
    docFile: doc.docFile
}