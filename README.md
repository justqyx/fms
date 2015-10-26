# nodeajax

Web 开发数据模拟环境，提供前端模拟 View 层解决方案。

> 参照 jQuery 设计 API，使用 JavaScript 编写AJAX模拟数据
使用 Smarty 编写后端模板引擎，提高前后端开发效率

- 模拟 AJAX
- 模拟 PHP Smarty 模板渲染

## 安装

```
npm install fms
```
## 轻松模拟数据

创建 app.js 文件，并写入如下内容
```js
var $ = require('fms')
$.doc('# 数据交互文档')

$.ajax('/ajax/').done({
    status: "success",
    msg: "成功加入会员"
})

$.ajax('/news/', {
    type: 'get'
}).done({
    title: "Web 开发数据模拟环境，提供 AJAX 模拟与后端 MVC 中 View 层渲染模拟解决方案。",
    content: "<p>参照 jQuery 设计 API，使用 JavaScript 编写AJAX模拟数据。使用 Smarty 编写后端模板引擎，提高前后端开发效率</p>"
})
$.ajax('/news/', {
    type: 'post'
}).done({
    status: "success",
    msg: "成功添加文章"
})

$.ajax('/function/').done(function (req, res) {
    res.json(req.query)
})
```

在命令行输入（推荐使用 [nodemon](https://github.com/remy/nodemon)）
```
cd [切换至 app.js 所在的目录]
node app
```

成功运行后将根据代码自动生成的控制台

<pre>
<img src="https://camo.githubusercontent.com/ff51534203c8403bc4d43f6c0418eec1345458ac/687474703a2f2f69312e74696574756b752e636f6d2f396232353833396337623462646564332e6a7067">
</pre>
