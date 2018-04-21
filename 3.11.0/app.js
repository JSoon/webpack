var express = require('express');
var fs = require('fs');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var logFormat = '[:date[iso]] ":method :url HTTP/:http-version" :status :response-time :res[content-length] [:remote-addr :remote-user] ":referrer" ":user-agent"';
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// var sassMiddleware = require('node-sass-middleware');
var constants = require('./build/constants');
var accessLogStream = fs.createWriteStream(path.join(constants.PATH_LOG, 'access.log'), {
    flags: 'a' // append模式
});

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// 生产模式下，记录日志
if (process.env.NODE_ENV === 'production') {
    app.use(logger(logFormat, {
        stream: accessLogStream
    }));
}
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
app.use(express.static(constants.PATH_SRC));
app.use(express.static(constants.PATH_PUBLIC));

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