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

    concat = require('gulp-concat');

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

/*
 * eslint
 */
gulp.task('lint', function lint() {
    return gulp.src(['src/js/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

gulp.task('lintw', function lint() {
    gulp.watch(['src/js/**/*.js'], ['lint']);
});


/*
 * gulp-connect
 */
gulp.task('connect', function() {
    connect.server({
        root: '',
        port: 8080
    });
});

/*
 * watch
 */
gulp.task('watch', function() {
    livereload.listen();
    gulp.watch(['./build/*.js'], livereload.changed);
    gulp.watch(['./src/css/*.css'], livereload.changed);
    gulp.watch(['./demo/*'], livereload.changed);
});

/*
 * gulp-strip-debug
 */
gulp.task('stripDebug', function() {
    return gulp.src('dist/tui-editor.js')
        .pipe(stripDebug())
        .pipe(gulp.dest('./dist'));
});

/*
 * Uglify
 */
gulp.task('uglify', function() {
    return gulp.src('./dist/tui-editor.js')
        .pipe(ugilfy())
        .pipe(rename('tui-editor.min.js'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('contentCssCopy', function() {
    return gulp.src([
            './src/css/tui-editor-contents.css',
            './src/css/tui-editor.css'
         ])
        .pipe(gulp.dest('./dist'));
});

gulp.task('dependencyModuleConcat', function() {
    return gulp.src(['./lib/tui-component-colorpicker/dist/colorpicker.js', './dist/tui-editor.js'])
        .pipe(concat('all.js'))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('build', gulpSync.sync(['lint', 'bundle', 'dependencyModuleConcat', 'uglify', 'contentCssCopy']));
