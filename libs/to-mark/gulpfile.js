'use strict';

var path = require('path');

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    webpack = require('webpack'),
    WebpackDevServer = require('webpack-dev-server'),
    eslint = require('gulp-eslint'),
    rename = require('gulp-rename'),
    ugilfy = require('gulp-uglify'),
    stripDebug = require('gulp-strip-debug'),
    livereload = require('gulp-livereload');

var gulpSync = require('gulp-sync')(gulp);

//Webpack
var WEBPACK_MAIN_ENTRY = './src/index.js',
    WEBPACK_DEV_PATH = path.join(__dirname, 'build/'),
    WEBPACK_DEV_FILE = 'bundle.js',
    WEBPACK_DIST_PATH = path.join(__dirname, 'dist/'),
    WEBPACK_DIST_FILE = 'to-mark.js',
    WEBPACK_OUT_LIB_TARGET = 'umd',
    WEBPACK_OUT_LIB = {
        root: 'toMark',
        amd: 'to-mark',
        commonjs: 'to-mark'
    };

//Production Build
gulp.task('lint', function lint() {
    return gulp.src(['src/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('bundle', function(callback) {
    // run webpack
    webpack({
        cache: false,
        entry: WEBPACK_MAIN_ENTRY,
        output: {
            path: WEBPACK_DIST_PATH,
            pathinfo: false,
            filename: WEBPACK_DIST_FILE,
            library: WEBPACK_OUT_LIB,
            libraryTarget: WEBPACK_OUT_LIB_TARGET
        }
    }, function(err, stats) {
        if (err) {
            throw new gutil.PluginError('webpack', err);
        }
        gutil.log('[webpack]', stats.toString({
            colors: true
        }));
        callback();
    });
});

gulp.task('uglify', function() {
    return gulp.src('./dist/to-mark.js')
        .pipe(ugilfy())
        .pipe(rename('to-mark.min.js'))
        .pipe(gulp.dest('./dist'));
});

//For Development
gulp.task('watch', function() {
    livereload.listen();
    gulp.watch(['./src/*'], livereload.changed);
    gulp.watch(['./demo/*'], livereload.changed);
});

gulp.task('develop', function() {
    // Start a webpack-dev-server
    new WebpackDevServer(webpack({
        entry: WEBPACK_MAIN_ENTRY,
        output: {
            path: WEBPACK_DEV_PATH,
            publicPath: '/build/',
            pathinfo: true,
            filename: WEBPACK_DEV_FILE,
            library: WEBPACK_OUT_LIB,
            libraryTarget: WEBPACK_OUT_LIB_TARGET

        },
        devtool: 'eval'
    }), {
        publicPath: '/build/',
        hot: true,
        stats: {
            colors: true
        }
    }).listen(8081, '0.0.0.0', function(err) {
        if (err) {
            throw new gutil.PluginError('webpack-dev-server', err);
        }

        gutil.log('[webpack-dev-server]', 'http://localhost:8081/webpack-dev-server/demo/demo.html');
    });
});

gulp.task('lintwatch', function lint() {
    gulp.watch(['src/*.js'], ['lint']);
});

gulp.task('stripDebug', function() {
    return gulp.src('dist/to-mark.js').pipe(stripDebug()).pipe(gulp.dest('./dist'));
});

gulp.task('build', gulpSync.sync(['lint', 'bundle', 'uglify']));
