var path = require('path');

module.exports = {
    // 入口模块
    // 推荐多入口模块写法：[filename]: [path]
    entry: {
        'main': './js/main.js'
    },

    // 输出模块
    output: {
        // 打包模块输出路径
        path: path.resolve(__dirname, 'dist'),

        // 按需加载模块的文件路径
        // 如：https://cdn.example.com/assets/
        publicPath: path.resolve(__dirname, 'dist') + '/',

        // 入口模块命名
        filename: "[name].bundle.js",

        // 分片模块（非入口模块）命名
        // 其中，chunkName由require.ensure()的第三个参数指定
        // require.ensure(dependencies: String[], callback: function(require), chunkName: String)
        // 若未指定第三个参数，则默认的chunkName为模块id（自动生成）
        chunkFilename: "[name].bundle.js"
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
    }
};