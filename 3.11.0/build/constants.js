/**
 * 常量配置
 * 
 * @author J.Soon <serdeemail@gmail.com>
 */
var path = require('path');
var buildDate = require('./date');

var PATH_ROOT = path.join(__dirname, '../'); // 项目根路径
var PATH_SRC = path.join(PATH_ROOT, 'src'); // 项目资源路径
var PATH_APP = path.join(PATH_SRC, 'app'); // 应用资源路径
var PATH_COM = path.join(PATH_APP, 'components'); // 组件
var PATH_PUBLIC = path.join(PATH_ROOT, 'public', buildDate); // 构建发布路径

module.exports = {
    PATH_ROOT: PATH_ROOT,
    PATH_SRC: PATH_SRC,
    PATH_APP: PATH_APP,
    PATH_COM: PATH_COM,
    PATH_PUBLIC: PATH_PUBLIC,
    PATH_PUBLIC_JS: path.join(PATH_PUBLIC, 'js'),
    PATH_PUBLIC_CSS: path.join(PATH_PUBLIC, 'css'),
    PATH_PUBLIC_IMG: path.join(PATH_PUBLIC, 'img'),

};