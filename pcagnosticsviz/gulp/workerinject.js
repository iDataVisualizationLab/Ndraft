'use strict';

var gulp = require('gulp'),
inject = require('gulp-inject');
var paths = gulp.paths;

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream,
    series = require('stream-series');

gulp.task('workerinject', function () {
    gulp.src(paths.dist + '/index.html')
        .pipe(inject.before('</body>', '<script src="myscript.js"></script>\n'))
        .pipe(gulp.dest(gulp.paths.dist +'/abc'));
});
