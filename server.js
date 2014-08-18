var express = require('express'),
    fs = require("fs"),
    path = require("path"),
    ejs = require("ejs"),
    index = require("./routes/index"),
    user = require("./routes/user"),
    upload = require("./routes/upload");

var app = express();

app.set('port', 3000);
app.set('view engine', 'ejs');//使用ejs模板引擎
app.use(express.static(path.join(__dirname, '/')));//设置可访问静态html文件

app.engine('.html', ejs.renderFile);

/*control*/
app.get("/", index.index)
app.post("/login", user.login);
app.post("/workUpload", upload.upload);
app.post("/userReg", user.userReg);
app.get("/work_item", upload.work_item)
app.get("/checkAuthcode", index.checkAuthcode);

app.listen(app.get("port"));//监听端口

/*设置500错误页面*/
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.send(500, '服务器端错误');
})
/*设置404错误页面*/
app.use(function (req, res, next) {
    res.send(404, '访问的资源不存在');
});
