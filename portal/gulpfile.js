// 构建依赖模块
const gulp = require('gulp');
const concat = require('gulp-concat');
const cssnano = require('gulp-cssnano');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const clean = require('gulp-clean');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const size = require('gulp-size');
const sequence = require('run-sequence'); // 控制构建任务执行顺序
const header = require('gulp-header');
const package = require('./package.json');
const banner = ['/**',
    ' * <%= pkg.name %> v<%= pkg.version %>',
    ' * Copyright <%= new Date().getFullYear() %> <%= pkg.author%>',
    ' * Licensed under the <%= pkg.license %> license',
    ' */',
    ''
].join('\n');

// 路径映射表
const paths = {
    assets: './assets',
    js: './assets/js',
    css: './assets/css',
    img: './assets/img',

    dist: './dist',
    distjs: './dist/js',
    distcss: './dist/css',
    distimg: './dist/img'
};

// 清空发布目录
gulp.task('clean', cleanTask);

// 合并压缩css样式表
gulp.task('css', cssTask);

// 合并压缩js脚本
gulp.task('js', jsTask);

// 图片压缩
gulp.task('image', imageTask);

// 发布
gulp.task('dist', distTask);

function cleanTask() {
    return gulp.src(paths.dist, {
            read: false
        })
        .pipe(clean());
}

function cssTask() {
    var files = [
        paths.css + '/*.css'
    ];

    return gulp.src(files)
        .pipe(concat('style.css'))
        .pipe(cssnano())
        .pipe(size({
            showFiles: true
        }))
        .pipe(gulp.dest(paths.distcss));
}

function jsTask() {
    var files = [
        paths.js + '/*.js'
    ];

    return gulp.src(files)
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(size({
            showFiles: true
        }))
        .pipe(gulp.dest(paths.distjs));
}

function imageTask() {
    var files = [
        paths.img + '/*'
    ];

    return gulp.src(files)
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
                }]
            })
        ]))
        .pipe(gulp.dest(paths.distimg));
}

function distTask(cb) {
    sequence('clean', [
        'js',
        'css',
        'image'
    ], cb);
}




// // 雪碧图
// gulp.task('sprite', function () {
//     var files = [paths.app + '/**/*.png'];
//     var spriteData = gulp.src(files).pipe(spritesmith({
//         imgName: 'sprite.png',
//         cssName: 'sprite.css',
//         imgPath: '../img/sprite.png',
//         algorithm: 'top-down'
//     }));

//     var imgStream = spriteData.img
//         .pipe(rename(function (path) {
//             path.dirname += '/img';
//         }))
//         .pipe(gulp.dest(paths.app));
//     var cssStream = spriteData.css
//         .pipe(rename(function (path) {
//             path.dirname += '/css';
//         }))
//         .pipe(gulp.dest(paths.app));

//     return merge(imgStream, cssStream);
// });