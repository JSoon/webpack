define(function () {
    'use strict';

    console.log('HELLO WORLD!');

    // 同步加载依赖模块，且不分片
    // 这里，a模块将会被同步加载，且a模块将会和main一起被打包成一个入口模块
    var a = require('./a.js');
});