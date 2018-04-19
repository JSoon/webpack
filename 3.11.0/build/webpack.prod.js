/**
 * webpack生产模式配置
 * 
 * 1. 管理模块间的依赖
 * 2. 提取公共模块
 * 3. 按需加载模块
 * 4. 打包入口模块
 * 
 * @author J.Soon <serdeemail@gmail.com>
 */

//基础配置文件
var webpack = require('webpack');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');
var merge = require('webpack-merge');
var commonConfig = require('./webpack.common');

module.exports = merge(commonConfig, {
    // 避免在生产中使用 inline-*** 和 eval-***，因为它们可以增加 bundle 大小，并降低整体性能。
    devtool: 'source-map',
    // 插件
    plugins: [
        // 压缩模块
        new UglifyJsPlugin({
            sourceMap: true,
            uglifyOptions: {
                compress: {
                    drop_console: true,
                    unsafe: true
                },
                ie8: true
            }
        }),
        // 指定环境
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        })
    ]
});