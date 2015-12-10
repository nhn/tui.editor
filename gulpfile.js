'use strict';

var gulp = require('gulp'),
    gutil = require('gulp-util'),

    //sourcemaps = require('gulp-sourcemaps'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    watchify = require('watchify'),
    browserify = require('browserify'),

    eslint = require('gulp-eslint'),
    connect = require('gulp-connect'),
    rename = require('gulp-rename'),
    ugilfy = require('gulp-uglify'),
    stripDebug = require('gulp-strip-debug'),
    livereload = require('gulp-livereload'),

    concatCss = require('gulp-concat-css'),
    concat = require('gulp-concat'),

    csslint = require('gulp-csslint');

var gulpSync = require('gulp-sync')(gulp);

/*
 * Browserify
 */
var bundler = watchify(browserify('./src/js/index.js', {
    debug: true
}));

//Development Build
function bundle() {
    return bundler.bundle()
        // log errors if they happen
        .on('error', gutil.log.bind(gutil, 'browserify error'))
        .pipe(source('bundle.js'))
        // optional, remove if you dont want sourcemaps
        //.pipe(buffer())
        //.pipe(sourcemaps.init({loadmaps: true})) // loads map from browserify file
        //.pipe(sourcemaps.write('./')) // writes .map file
        //
        .pipe(gulp.dest('./build'));
}

bundler.on('update', bundle);
bundler.on('log', gutil.log);

gulp.task('develop', bundle);

//Production Build
gulp.task('bundle', function() {
    return browserify('./src/js/index.js')
        .bundle()
        .pipe(source('tui-editor.js'))
        .pipe(buffer())
        .pipe(stripDebug())
        .pipe(gulp.dest('./dist'));
});

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

gulp.task('connect', function() {
    connect.server({
        root: '',
        port: 8080
    });
});

gulp.task('watch', function() {
    livereload.listen();
    gulp.watch(['./build/*.js'], livereload.changed);
    gulp.watch(['./src/css/*.css'], livereload.changed);
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
