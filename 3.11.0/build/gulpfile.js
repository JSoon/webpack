'use strict';

//#region 依赖注入
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
var imagemin = require('gulp-imagemin');
//#endregion

//#region Scss to CSS
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
        // 容错执行
        .pipe(plumber())
        .pipe(sourcemaps.init())
        // sass to css
        .pipe(sass().on('error', sass.logError))
        /**
         * 1. 样式表兼容处理
         * 2. 图片url处理（重命名导出、base64等等）
         */
        .pipe(
            postcss([
                precss,
                autoprefixer,
                url(urlOptions)
            ])
        )
        // 输出sourcemaps
        .pipe(sourcemaps.write(constants.PATH_PUBLIC_CSS))
        // 目录找平（/app/demo/demo.css -> /demo.css）
        .pipe(flatten())
        // 控制台文件大小输出
        .pipe(size({
            showFiles: true,
            showTotal: true
        }))
        .pipe(gulp.dest(constants.PATH_PUBLIC_CSS));
};
//#endregion

//#region 图片资源优化
var imageTask = function () {
    return gulp.src(constants.PATH_PUBLIC_IMG + '/*')
        // 容错执行
        .pipe(plumber())
        .pipe(imagemin([
            imagemin.gifsicle({
                interlaced: true
            }),
            imagemin.jpegtran({
                progressive: true
            }),
            imagemin.optipng({
                optimizationLevel: 5
            }),
            imagemin.svgo({
                plugins: [{
                        removeViewBox: true
                    },
                    {
                        cleanupIDs: false
                    }
                ]
            })
        ]))
        .pipe(gulp.dest(constants.PATH_PUBLIC_IMG));
}
//#endregion

//#region 初始化执行任务
var initTask = function () {
    return sequence(
        'sass'
    )(function (err) {
        if (err) console.log(err)
    });
};
//#endregion

//#region 任务注册
gulp.task('sass', sassTask);
gulp.task('image', imageTask);
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
        'sass',
        'image'
    )(function (err) {
        if (err) console.log(err)
    });
});
//#endregion