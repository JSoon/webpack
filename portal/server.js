var express = require('express');
var httpProxy = require('http-proxy');
var path = require('path');
var app = express();
var router = express.Router();
var port = 4000;
var pages = {
    index: path.join(__dirname + '/src/index.html')
};

// 代理服务器
var proxy = httpProxy.createProxyServer({
    changeOrigin: true // changes the origin of the host header to the target URL
});

proxy.on('error', function (e) {
    console.log('error:', e);
});

// // 拦截以music-h5开头的请求，将其代理到http://m.music.migu.cn域名下
// router.get(/^\/music-h5./, function (req, res) {
//   console.log(req.url);
//   proxy.web(req, res, {
//     target: 'http://m.music.migu.cn' // the target URL you want to proxy to
//   });
// });

// 静态资源服务
// app.use('/', express.static(path.join(__dirname, 'assets'))); // 开发资源
app.use('/', express.static(path.join(__dirname, 'dist'))); // 发布资源

/**
 * 路由配置
 */
// 匹配首页
router.get('/', function (req, res) {
    res.sendFile(pages.index);
});

// // 匹配所有http://localhost/开头的url
// router.get('/*', function (req, res) {
//   if (!/\/test/.test(req.url)) {
//     res.sendFile(pages.index);
//     return;
//   }
//   // 单独处理播放器测试页
//   res.sendFile(pages.test);
// });

app.use(router);
app.listen(port);

console.log("App active on localhost:" + port);