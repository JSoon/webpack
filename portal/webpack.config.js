/**
 * webpack配置
 * 
 * 1. 管理模块间的依赖
 * 2. 提取公共模块
 * 3. 按需加载模块
 * 4. 打包入口模块
 * 5. 预编译LESS文件（考虑要不要放入gulp来实现）
 */

const webpack = require('webpack');

// path模块，用于处理文件和目录路径的工具
const path = require('path');

// less autoprefix，用于增加对老式浏览器CSS样式的兼容前缀
const LessPluginAutoPrefix = require('less-plugin-autoprefix');

// 提取出模块中所有引入的样式表文件，将其打包成一个独立的CSS文件
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    // 入口模块
    // 推荐多入口模块写法：[filename]: [path]
    entry: {
        'vendor': [
            'jquery',
            'lodash'
        ],
        'main': './src/js/main.js',
        'main2': './src/js/main2.js'
    },

    // 输出模块
    output: {
        // 打包模块输出路径
        path: path.resolve(__dirname, 'assets'),

        // 按需加载模块的文件路径
        // 如：https://cdn.example.com/assets/
        publicPath: '/assets/',

        // 入口模块命名
        filename: 'js/[name].bundle.js',

        // 分片模块（非入口模块）命名
        // 其中，chunkName由require.ensure()的第三个参数指定
        // require.ensure(dependencies: String[], callback: function(require), chunkName: String)
        // 若未指定第三个参数，则默认的chunkName为模块id（自动生成）
        chunkFilename: 'js/[name].bundle.js'
    },

    // 观察模式
    // 监测代码，并在代码改变的时候进行重新编译
    watch: true,
    watchOptions: {
        // 当代码首次被改变后增加一个时间延迟
        // 如果在这段延迟时间内，又有其他代码发生了改变，
        // 则其他的改变也将在这段延迟时间后，一并进行编译
        aggregateTimeout: 300,

        // 不进行监测的文件
        // 监测大量的文件将占用CPU或许多内存空间，例如node_modules
        ignored: /node_modules/

        // 每隔一段时间，自动检查代码的改变，例如1000表示每秒进行一次检查
        // 在观察模式不起作用的时候，可以尝试打开这个配置项
        // poll: 1000 
    },

    // loaders加载器，用于将任何静态资源进行预处理，然后转换成JS代码方便webpack使用
    // 例如：require('a.css')的时候，直接将CSS变成一段JS，用这段JS将样式插入DOM中
    module: {
        rules: [
            // 处理LESS文件
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    // 通过JS创建style节点，并将其插入<head>中
                    fallback: 'style-loader',

                    use: [
                        {
                            // 解析CSS样式表，将其中的@import和url()当作require来处理
                            loader: 'css-loader'
                        },
                        {
                            // 将LESS编译成CSS文件
                            loader: 'less-loader',
                            options: {
                                compress: false,
                                plugins: [
                                    new LessPluginAutoPrefix({
                                        // 规则文档
                                        // https://github.com/ai/browserslist#queries
                                        browsers: ['Chrome <= 25']
                                    })
                                ]
                            }
                        }
                    ]

                    // publicPath: '/' // 针对该loader覆盖output中的publicPath
                })
            },
            // 将LESS中的url进行处理
            // 若图片大小小于等于25kb，则直接转换为base64格式，以减少请求数量
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            name: 'img/[name]-[hash].[ext]',
                            limit: 25000 // 单位：Byte，这里25000b===25kb
                        }
                    }
                ]
            }

            // // 将某些不支持模块化规范的模块所声明的全局变量作为模块内容导出
            // // 如AMD的模块a中有一方法，没有return，则require(a)===undefined
            // {
            //     test: '',
            //     use: [{
            //         loader: 'exports-loader'
            //     }]
            // }
        ]
    },

    // 插件
    plugins: [
        // 合并打包第三方库分片
        new webpack.optimize.CommonsChunkPlugin({
            // 入口模块名
            name: 'vendor',

            // 用于重命名公共分片文件名
            // 默认分片名同output中的filename或chunkFilename
            // 例如，vendor.bundle.js
            // filename: 'vendor.js',

            // 使用公共模块的入口模块的最小数量n，2 <= n <= 入口模块总数
            // 例如，minChunks: 3，表示若一个模块同时被3个及以上的入口模块所调用，才将其提取为一个公共分片
            // 若为Infinity，则仅仅创建该公共分片，不提取任何公共模块（适用于打包合并第三方库分片）
            minChunks: Infinity
        }),

        // 提取多个入口模块间的公共分片，用于在各模块间共享使用
        // 通过与其他模块解绑，使得该公共分片只需要加载一次，便能够进行缓存，
        // 当新页面加载时，该公共分片将直接从缓存中提取，而不需要重新加载
        new webpack.optimize.CommonsChunkPlugin({
            // 公共分片名
            name: 'common',

            // 需要提取公共模块的入口模块
            chunks: [
                'main',
                'main2'
            ]
        }),

        // 自动加载模块，配置好的模块在使用的时候，将不再需要传入依赖数组
        // 这里将jquery作为自动加载模块，在其他模块内使用$,jQuery则能直接调用
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),

        // 提取独立样式表
        new ExtractTextPlugin('css/style.css')
    ]
};