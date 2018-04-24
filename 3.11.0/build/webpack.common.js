/**
 * webpack基础配置
 * 
 * 1. 管理模块间的依赖
 * 2. 提取公共模块
 * 3. 按需加载模块
 * 4. 打包入口模块
 * 
 * @author J.Soon <serdeemail@gmail.com>
 */

var webpack = require('webpack');
var path = require('path');
var constants = require('./constants');
var package = require('../package.json');

module.exports = {
    // 入口模块
    // 推荐多入口模块写法：[filename]: [path]
    entry: {
        // 公用库单独提取打包
        // 'vendor': [],
        'demo': path.join(constants.PATH_APP, 'demo/demo')
    },
    // 输出模块
    output: {
        // 打包模块输出路径
        path: constants.PATH_PUBLIC_JS,

        // 按需加载模块的文件路径
        // 如：https://cdn.example.com/assets/
        publicPath: '/',

        // 入口模块命名
        filename: '[name].js',

        // 分片模块（非入口模块）命名
        // 其中，chunkName由require.ensure()的第三个参数指定
        // require.ensure(dependencies: String[], callback: function(require), chunkName: String)
        // 若未指定第三个参数，则默认的chunkName为模 块id（自动生成）
        chunkFilename: '[name].chunk.js'
    },
    // loaders加载器，用于将任何静态资源进行预处理，然后转换成JS代码方便webpack使用
    // 例如：require('a.css')的时候，直接将CSS变成一段JS，用这段JS将样式插入DOM中
    module: {
        rules: [
            // babel巴别塔
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            // 根据名单来编译js语法，以达到不同浏览器环境下的兼容性（与autoprefixer共享同一份名单）
                            ['env', {
                                'targets': {
                                    // The % refers to the global coverage of users from browserslist
                                    'browsers': package.browserslist
                                }
                            }]
                        ]
                    }
                }]
            },
            // pug模板
            {
                test: /\.pug$/,
                use: [{
                    loader: 'pug-loader'
                }]
            }
        ]
    },
    /**
     * 解析
     */
    resolve: {
        // 给路径添加别名，可有效避免模块中require的路径过长
        alias: {
            app: constants.PATH_APP,
            components: constants.PATH_COM
        }
    },
    /**
     * 提供一种能将第三方库模块排除在业务模块打包之外的方法（对基于第三方库开发的站点友好）
     * 例如：
     配置：
     {
        externals: {
            // require('jquery')将不会被打包进业务模块
            // 且jQuery将被导出为全局变量
            'jquery': 'jQuery'
        }
    }
    打包结果：
    {
        1: function(...) {
            module.exports = jQuery;
        }
    }
     */
    externals: {
        'jquery': '$'
    },
    // 插件
    plugins: [
        // Runtime分片，用于提供webpack运行所需环境
        // 参考资料：
        // https://stackoverflow.com/questions/35184240/webpack-error-in-commonschunkplugin-while-running-in-normal-mode-its-not-allow
        // http://www.cnblogs.com/myqianlan/p/5626505.html
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest', // something that's not an entry
            minChunks: Infinity
        }),

        // // 合并打包第三方库分片
        // // 注意，在这里，第三方库vendor代码中，不能包含任何的require，否则在打包时，这些require依赖库不会被打包进vendor中，导致代码执行错误
        // new webpack.optimize.CommonsChunkPlugin({
        //     // 入口模块名
        //     names: [
        //         'vendor'
        //         // 'musicPlay', // 注意，musicPlay中require其他依赖库，不能在此指定，故直接写进entry中即可
        //         // 'comment' // 注意，comment中require其他依赖库，不能在此指定，故直接写进entry中即可
        //     ],

        //     // 用于重命名公共分片文件名
        //     // 默认分片名同output中的filename或chunkFilename
        //     // 例如，vendor.bundle.js
        //     // filename: 'vendor.js',

        //     // 使用公共模块的入口模块的最小数量n，2 <= n <= 入口模块总数
        //     // 例如，minChunks: 3，表示若一个模块同时被3个及以上的入口模块所调用，才将其提取为一个公共分片
        //     // 若为Infinity，则仅仅创建该公共分片，不提取任何公共模块（适用于打包合并第三方库分片）
        //     minChunks: Infinity
        // }),

        // // 自动加载模块，配置好的模块在使用的时候，将不再需要传入依赖数组
        // // 这里将jquery作为自动加载模块，在其他模块内使用$,jQuery则能直接调用
        // new webpack.ProvidePlugin({
        //     _: 'lodash'
        // })
    ]
};