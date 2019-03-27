'use strict';

var gulp = require('gulp');

var paths = gulp.paths;

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream,
    series = require('stream-series');

gulp.task('workerinject', ['styles'], function () {


    var injectWorker = gulp.src(['bower_components/ng-webworker/src/ng-webworker.js', 'bower_components/ng-webworker/src/worker_wrapper.js'])
        .pipe(gulp.dest(paths.dist + '/scripts/'));

    var injectOptions = {
        ignorePath: [paths.src, paths.tmp + '/serve'],
        addRootSlash: false
    };
     return gulp.src(paths.src + '/*.html')
        .pipe($.inject(injectWorker), injectOptions);

});
