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
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');
var del = require('del');
var sequence = require('gulp-sequence');
var watch = require('gulp-watch');
var imagemin = require('gulp-imagemin');
var copy = require('gulp-copy');
//#endregion

// 构建环境
var ENV_PRODUCTION = false; // 生产环境变量，默认false

//#region Scss to CSS
var sassTask = function () {
    // 注意：该配置会按照顺序执行，作用对象为编译后的CSS样式表
    var urlOptions = [
        //#region 处理图片
        // 1. 处理图片url
        {
            filter: /^.*\.(svg|png|jpe?g|gif)$/,
            url: 'inline',
            maxSize: 10,
            // 大于10kb的图片，执行fallback回调
            // 复制样式表中的图片
            fallback: 'copy',
            assetsPath: constants.PATH_PUBLIC_IMG,
            useHash: true // 对引用资源进行hash命名
        },
        // 2. 重写图片url路径（自定义）
        {
            filter: /^.*\.(svg|png|jpe?g|gif)$/,
            url: function (asset) {
                // console.log(asset);
                // asset.url: '../public/20180723/img/e3d37c68.png'
                // 如下语句，第二个参数'$1'指向捕获分组1的引用，将整个url替换为/img/...，也即是'/img/e3d37c68.png'
                var parsedUrl = asset.url.replace(/.*(\/img\/.*)/, '$1');
                return parsedUrl;
            },
            multi: true
        },
        //#endregion
        //#region 处理字体
        // 3. 处理字体url
        {
            filter: /^.*\.(eot|woff2|woff|ttf|otf)$/,
            url: 'copy',
            assetsPath: constants.PATH_PUBLIC_FONT,
            useHash: true // 对引用资源进行hash命名
        },
        // 4. 重写样式表中的字体url路径（自定义）
        {
            filter: /^.*\.(eot|woff2|woff|ttf|otf)$/,
            url: function (asset) {
                // console.log(asset);
                var parsedUrl = asset.url.replace(/.*(\/fonts\/.*)/, '$1');
                return parsedUrl;
            },
            multi: true
        },
        //#endregion
    ];

    var stream = gulp.src(constants.PATH_APP + '/**/*.scss');

    // 开发环境任务
    if (!ENV_PRODUCTION) {
        stream = stream
            .pipe(watch(constants.PATH_APP + '/**/*.scss'))
            // 容错执行
            .pipe(plumber())
            .pipe(sourcemaps.init())
            // sass to css
            .pipe(sass().on('error', sass.logError));
    }
    // 生产环境任务
    else {
        stream = stream
            // 容错执行
            .pipe(plumber())
            .pipe(sourcemaps.init())
            // sass to css
            .pipe(sass({
                outputStyle: 'compressed'
            }).on('error', sass.logError));
    }

    stream = stream
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

    return stream;
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

//#region 复制静态资源到发布目录
var assetsMoveTask = function () {
    var files = [
        constants.PATH_ASSET + '/**/*'
        // constants.PATH_HTML + '/**/*',
        // constants.PATH_IMG + '/**/*',
        // constants.PATH_JS + '/**/*',
        // constants.PATH_LIB + '/**/*',
        // constants.PATH_ASSET + '/favicon.ico'
    ];

    var stream = gulp.src(files);

    // 开发环境任务
    if (!ENV_PRODUCTION) {
        stream = stream
            .pipe(watch(files))
            .pipe(copy(constants.PATH_PUBLIC, {
                // integer, defining how many parts of the path (separated by /) should be removed from the original path
                prefix: 3
            }))
    }
    // 生产环境任务
    else {
        stream = stream
            .pipe(copy(constants.PATH_PUBLIC, {
                // integer, defining how many parts of the path (separated by /) should be removed from the original path
                prefix: 3
            }))
    }

    return stream;
};
//#endregion

//#region 清空发布目录
var cleanTask = function () {
    return del([constants.PATH_PUBLIC + '/**'], {
        force: true
    })
};
//#endregion

//#region 初始化执行任务
var initTask = function () {
    sassTask();
    assetsMoveTask();
};
//#endregion

//#region 任务注册
gulp.task('sass', sassTask);
gulp.task('assetsMove', assetsMoveTask);
gulp.task('image', imageTask);
gulp.task('init', initTask);
gulp.task('clean', cleanTask);

// 开发模式任务
gulp.task('development', [
    'sass',
    'assetsMove'
], function () {
    // initTask();
});

// 生产模式任务（最终资源发布）
gulp.task('production', function () {
    ENV_PRODUCTION = true;

    cleanTask().then(function () {
        console.log('================== 生产环境资源构建开始（发布目录清空完毕） ==================');

        sequence(
            'sass',
            'assetsMove',
            // 'imageMin',
            // 'script'
        )(function (err) {
            if (err) console.log(err)

            console.log('================== 生产环境资源构建完毕 ==================');
        });
    });
});
//#endregion