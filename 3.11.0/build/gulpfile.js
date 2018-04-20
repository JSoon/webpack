'use strict';

var constants = require('./constants');
var gulp = require('gulp');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var precss = require('precss');
var autoprefixer = require('autoprefixer');
var url = require('postcss-url');
var sourcemaps = require('gulp-sourcemaps');
var flatten = require('gulp-flatten');
var size = require('gulp-size');
var plumber = require('gulp-plumber');
var del = require('del');
var sequence = require('gulp-sequence');
var watch = require('gulp-watch');

// Scss to CSS
var sassTask = function () {
    var urlOptions = [
        // 处理行内url
        {
            filter: /^.*\.(svg|png|jpe?g|gif)$/,
            url: 'inline',
            maxSize: 10,
            // 大于10kb的图片，执行fallback回调
            // 复制样式表中的图片
            fallback: 'copy',
            assetsPath: constants.PATH_PUBLIC_IMG,
            useHash: true
        },
        // 重写样式表中的url路径（自定义）
        {
            filter: /^.*\.(svg|png|jpe?g|gif)$/,
            url: function (asset) {
                // console.log(asset);
                var parsedUrl = asset.url.replace(/.*(\/img\/.*)/, '$1');
                return parsedUrl;
            },
            multi: true
        }
    ];

    return gulp.src(constants.PATH_APP + '/**/*.scss')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(
            postcss([
                precss,
                autoprefixer,
                url(urlOptions)
            ])
        )
        .pipe(sourcemaps.write(constants.PATH_PUBLIC_CSS))
        .pipe(flatten())
        .pipe(size({
            showFiles: true,
            showTotal: true
        }))
        .pipe(gulp.dest(constants.PATH_PUBLIC_CSS));
};

// 初始化执行任务
var initTask = function () {
    return sequence(
        'sass'
    )(function (err) {
        if (err) console.log(err)
    });
};

gulp.task('sass', sassTask);

gulp.task('init', initTask);

// 开发模式任务
gulp.task('development', function () {
    initTask();
    watch(constants.PATH_APP + '/**/*', function () {
        initTask();
    });
});

// 产品模式任务（最终资源发布）
gulp.task('production', function () {
    sequence(
        'sass'
    )(function (err) {
        if (err) console.log(err)
    });
});