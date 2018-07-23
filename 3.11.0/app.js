var express = require('express');
var fs = require('fs');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var constants = require('./build/constants');
var app = express();

//#region 日志系统
var logger = require('morgan');
logger.token('localDate', function (req, res) {
    return new Date();
});
// 日志格式：系统本地时间 | http请求方法 | 请求地址 | http版本 | 请求状态码 | 响应时间 | 响应资源大小 | 远程服务器IP地址 | 远程用户IP地址 | 请求来源资源 | 用户代理信息
// 参考文档：https://www.npmjs.com/package/morgan
var logFormat = '[:localDate] ":method :url HTTP/:http-version" :status :response-time :res[content-length] [:remote-addr :remote-user] ":referrer" ":user-agent"';
// var sassMiddleware = require('node-sass-middleware');
var accessLogStream;
var currentDate = require('./build/date');
var logFile = path.join(constants.PATH_LOG, currentDate + '_access.log');
// 检查日志文件是否存在，若存在则写入，不存在则创建
fs.stat(logFile, function (err, stat) {
    if (err == null) {
        console.log(logFile, 'exists');
    } else if (err.code == 'ENOENT') {
        // file does not exist
        fs.writeFile(logFile);
    } else {
        console.log('Some other error: ', err.code);
    }
});
// 生产模式下，记录日志
//if (process.env.NODE_ENV === 'production') {
accessLogStream = fs.createWriteStream(logFile, {
    flags: 'a' // append模式
});
app.use(logger(logFormat, {
    stream: accessLogStream
}));
//}
//#endregion

var index = require('./routes/index');
var users = require('./routes/users');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
// 使用gulp-sass代替sass中间件
// app.use(sassMiddleware({
//     src: constants.PATH_SRC,
//     dest: constants.PATH_PUBLIC_CSS,
//     indentedSyntax: false, // true = .sass and false = .scss
//     // outputStyle: 'compressed', 
//     // sourceMap: true
// }));

// 静态资源代理
app.use(express.static(constants.PATH_ROOT));
app.use(express.static(constants.PATH_SRC));
app.use(express.static(constants.PATH_PUBLIC));
app.use(express.static(constants.PATH_PUBLIC_HTML));
// uncomment after placing your favicon in /public
// app.use(favicon(path.join(constants.PATH_PUBLIC, 'favicon.ico')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;