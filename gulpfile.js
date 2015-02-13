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

    livereload = require('gulp-livereload');

/*
 * Browserify
 */
var bundler = watchify(browserify('./src/js/etc/enums.js', watchify.args));
//bundler.transform('brfs');
function bundle() {
    return bundler.bundle()
        // log errors if they happen
        .on('error', gutil.log.bind(gutil, 'browserify error'))
        .pipe(source('bundle.js'))
        // optional, remove if you dont want sourcemaps
        .pipe(buffer())
        .pipe(sourcemaps.init({loadmaps: true})) // loads map from browserify file
        .pipe(sourcemaps.write('./')) // writes .map file
        //
        .pipe(gulp.dest('./build'));
}

gulp.task('run', bundle); // so you can run `gulp js` to build the file
bundler.on('update', bundle); // on any dep update, runs the bundler


/*
 * eslint
 */
gulp.task('lint', function lint() {
    return gulp.src(['src/js/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
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
