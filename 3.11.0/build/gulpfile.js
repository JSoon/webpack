'use strict';

var constants = require('./constants');
var gulp = require('gulp');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var sourcemaps = require('gulp-sourcemaps');
var flatten = require('gulp-flatten');
var size = require('gulp-size');
var plumber = require('gulp-plumber');
var del = require('del');
var sequence = require('gulp-sequence');
var watch = require('gulp-watch');

// Scss to CSS
var sassTask = function () {
    return gulp.src(constants.PATH_APP + '/**/*.scss')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([
            require('precss'),
            require('autoprefixer')
        ]))
        .pipe(sourcemaps.write(constants.PATH_PUBLIC_CSS))
        .pipe(flatten())
        .pipe(size({
            showFiles: true,
            showTotal: true
        }))
        .pipe(gulp.dest(constants.PATH_PUBLIC_CSS));
};

// 初始化执行任务
var initTasks = function () {
    sassTask();
};

gulp.task('sass', sassTask);

// 开发模式任务
gulp.task('development', function () {
    initTasks();
    watch(constants.PATH_APP + '/**/*', function () {
        initTasks();
    });
});

// 产品模式任务（最终资源发布）
gulp.task('production', sequence(
    'sass'
));