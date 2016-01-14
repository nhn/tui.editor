'use strict';

var gulp = require('gulp'),
    gutil = require('gulp-util'),

    webpack = require('webpack'),
    WebpackDevServer = require('webpack-dev-server'),

    eslint = require('gulp-eslint'),
    rename = require('gulp-rename'),
    ugilfy = require('gulp-uglify'),
    stripDebug = require('gulp-strip-debug'),
    livereload = require('gulp-livereload'),

    concatCss = require('gulp-concat-css'),
    concat = require('gulp-concat'),

    csslint = require('gulp-csslint');

var gulpSync = require('gulp-sync')(gulp);


//Webpack
var WEBPACK_MAIN_ENTRY = './src/js/index.js',
    WEBPACK_DEV_PATH = __dirname + '/build/',
    WEBPACK_DEV_FILE = 'bundle.js',
    WEBPACK_DIST_PATH = __dirname + '/dist/',
    WEBPACK_DIST_FILE ='tui-editor.js';

gulp.task('bundle', function(callback) {
    // run webpack
    webpack({
        cache: false,
        entry: WEBPACK_MAIN_ENTRY,
        output: {
            path: WEBPACK_DIST_PATH,
            pathinfo: false,
            filename: WEBPACK_DIST_FILE
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

gulp.task('develop', function() {
    // Start a webpack-dev-server
    new WebpackDevServer(webpack({
        entry: WEBPACK_MAIN_ENTRY,
        output: {
            path: WEBPACK_DEV_PATH,
            publicPath: '/build/',
            pathinfo: true,
            filename: WEBPACK_DEV_FILE
        },
        devtool: 'eval'
    }), {
        publicPath: '/build/',
        hot: true,
        stats: {
            colors: true
        }
    }).listen(8080, 'localhost', function(err) {
        if (err) throw new gutil.PluginError('webpack-dev-server', err);
        gutil.log('[webpack-dev-server]', 'http://localhost:8080/webpack-dev-server/index.html');
    });
});

//Production Build
gulp.task('lint', function lint() {
    return gulp.src(['src/js/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

gulp.task('csslint', function() {
    gulp.src('src/css/*.css')
        .pipe(csslint({
            'important': false,
            'adjoining-classes': false,
            'known-properties': true,
            'box-sizing': false,
            'box-model': false,
            'overqualified-elements': false,
            'display-property-grouping': false,
            'bulletproof-font-face': true,
            'compatible-vendor-prefixes': true,
            'regex-selectors': false,
            'errors': true,
            'duplicate-background-images': true,
            'duplicate-properties': true,
            'empty-rules': true,
            'selector-max-approaching': false,
            'gradients': false,
            'fallback-colors': false,
            'font-sizes': false,
            'font-faces': false,
            'floats': true,
            'star-property-hack': false,
            'outline-none': false,
            'import': true,
            'ids': true,
            'underscore-property-hack': false,
            'rules-count': false,
            'qualified-headings': false,
            'selector-max': true,
            'shorthand': false,
            'text-indent': false,
            'unique-headings': false,
            'universal-selector': false,
            'unqualified-attributes': false,
            'vendor-prefix': false,
            'zero-units': true
        }))
        .pipe(csslint.reporter());
});

gulp.task('lintw', function lint() {
    gulp.watch(['src/js/**/*.js'], ['lint']);
});

gulp.task('watch', function() {
    livereload.listen();
    gulp.watch(['./src/**/*'], livereload.changed);
    gulp.watch(['./demo/*'], livereload.changed);
});

gulp.task('stripDebug', function() {
    return gulp.src('dist/tui-editor.js')
        .pipe(stripDebug())
        .pipe(gulp.dest('./dist'));
});

gulp.task('uglify', function() {
    return gulp.src('./dist/tui-editor.js')
        .pipe(ugilfy())
        .pipe(rename('tui-editor.min.js'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('contentCssCopy', function() {
    return gulp.src([
            './src/css/tui-editor-contents.css'
         ])
        .pipe(gulp.dest('./dist'));
});

gulp.task('depsCssConcat', function() {
    return gulp.src(['./src/css/tui-editor.css', './lib/tui-component-colorpicker/dist/colorpicker.css'])
        .pipe(concatCss('tui-editor.css'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('depsModuleConcat', function() {
    return gulp.src(['./lib/tui-component-colorpicker/dist/colorpicker.min.js', './dist/tui-editor.js'])
        .pipe(concat('tui-editor.js'))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('build', gulpSync.sync(['lint', 'csslint', 'bundle', 'depsModuleConcat', 'uglify', 'contentCssCopy', 'depsCssConcat']));
