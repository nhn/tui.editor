'use strict';

var gulp = require('gulp'),
    gutil = require('gulp-util'),

    sourcemaps = require('gulp-sourcemaps'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    watchify = require('watchify'),
    browserify = require('browserify'),

    eslint = require('gulp-eslint'),

    connect = require('gulp-connect'),

    rename = require('gulp-rename'),

    ugilfy = require('gulp-uglify'),

    stripDebug = require('gulp-strip-debug'),

    livereload = require('gulp-livereload');

/*
 * Browserif
 */
var bundler = watchify(browserify('./src/js/index.js', {
    debug: true
}));

//bundler.transform('brfs');
function bundle(changedFiles) {
    gutil.log("changed", changedFiles);
    return bundler.bundle()
        // log errors if they happen
        .on('error', gutil.log.bind(gutil, 'browserify error'))
        .pipe(source('bundle.js'))
        // optional, remove if you dont want sourcemaps
        .pipe(buffer())
        //sourcemaps 플러그인으로 만든 소스맵이 정상적으로 작동하지 않는다.
        //.pipe(sourcemaps.init({loadmaps: true})) // loads map from browserify file
        //.pipe(sourcemaps.write('./')) // writes .map file
        //
        .pipe(gulp.dest('./build'));
}

bundler.on('update', bundle); // on any dep update, runs the bundler
gulp.task('develop', bundle); // so you can run `gulp js` to build the file

gulp.task('bundle', function() {
    return browserify('./src/js/index.js')
        .bundle()
        .pipe(source('ned.js'))
        .pipe(buffer())
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

gulp.task('watch', function () {
    livereload.listen();
    gulp.watch(['./build/*.js'], livereload.changed);
    gulp.watch(['./demo/*'], livereload.changed);
});


/*
 * Uglify
 */
gulp.task('uglify', function() {
    return gulp.src('./dist/ned.js')
        .pipe(stripDebug())
        .pipe(ugilfy())
        .pipe(rename('ned.min.js'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('build', ['lint', 'bundle', 'uglify']);
