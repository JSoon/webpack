/**
 * 常量配置
 * 
 * @author J.Soon <serdeemail@gmail.com>
 */
var path = require('path');
var deployDate = require('./deploy.date');

var PATH_ROOT = path.join(__dirname, '../'); // 项目根路径
var PATH_SRC = path.join(PATH_ROOT, 'src'); // 项目资源路径
var PATH_APP = path.join(PATH_SRC, 'app'); // 应用资源路径
var PATH_COM = path.join(PATH_SRC, 'components'); // 组件
var PATH_ASSET = path.join(PATH_SRC, 'assets'); // 静态资源路径
var PATH_HTML = path.join(PATH_ASSET, 'html'); // 静态页面
var PATH_JS = path.join(PATH_ASSET, 'js'); // 静态脚本
var PATH_IMG = path.join(PATH_ASSET, 'img'); // 静态图片
var PATH_FONT = path.join(PATH_ASSET, 'fonts'); // 静态字体
var PATH_LIB = path.join(PATH_ASSET, 'lib'); // 第三方库
var PATH_PUBLIC = path.join(PATH_ROOT, 'public', deployDate); // 构建发布路径
var PATH_LOG = path.join(PATH_ROOT, 'logs'); // 日志

module.exports = {
    PATH_ROOT: PATH_ROOT,
    PATH_SRC: PATH_SRC,
    PATH_APP: PATH_APP,
    PATH_COM: PATH_COM,
    PATH_ASSET: PATH_ASSET,
    PATH_HTML: PATH_HTML,
    PATH_JS: PATH_JS,
    PATH_IMG: PATH_IMG,
    PATH_FONT: PATH_FONT,
    PATH_LIB: PATH_LIB,
    PATH_PUBLIC: PATH_PUBLIC,
    PATH_PUBLIC_HTML: path.join(PATH_PUBLIC, 'html'),
    PATH_PUBLIC_JS: path.join(PATH_PUBLIC, 'js'),
    PATH_PUBLIC_CSS: path.join(PATH_PUBLIC, 'css'),
    PATH_PUBLIC_IMG: path.join(PATH_PUBLIC, 'img'),
    PATH_PUBLIC_FONT: path.join(PATH_PUBLIC, 'fonts'),
    PATH_LOG: PATH_LOG
};