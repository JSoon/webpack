define(function () {
    'use strict';

    console.log('HELLO WORLD!');

    // 同步加载依赖模块，且不分片
    // 这里，a模块将会被同步加载，且a模块将会和main一起被打包成一个入口模块
    var a = require('./a.js');

    // 异步加载依赖模块，且分片
    // 这里，b模块将会通过jsonp的方式被异步加载（但并不会被执行）
    // 且依赖数组中的模块以及回调函数中require的模块，都将被打包成同一个新的分片模块
    require.ensure(['./b.js'], function () {
        var b = require('./b.js');
    });

    // 异步加载依赖模块，且分片
    // 这里，c和d模块将会通过jsonp的方式被异步加载（同时会被执行）
    // 且依赖数组中的模块以及回调函数中require的模块，都将被打包成同一个新的分片模块
    require(['./c.js', './d.js'], function (c, d) {
        // 这句将不会被调用，因为同一个模块不会被重复加载
        require('./a.js');

        require('./e.js');

    });
});