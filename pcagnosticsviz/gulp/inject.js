'use strict';
var uglify = require('gulp-uglify');
var gulp = require('gulp');

var paths = gulp.paths;

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream,
  series = require('stream-series');

gulp.task('inject', ['styles'], function () {

  var injectStyles = gulp.src([
    paths.tmp + '/serve/{app,components}/**/*.css',
    '!' + paths.tmp + '/serve/app/vendor.css'
  ], { read: false });

  var injectVendor = gulp.src([
    paths.src + '/vendor/**/*.js'
    ], { read: false });

  var injectScripts = gulp.src([
    paths.src + '/{app,components}/**/*.js',
    '!' + paths.src + '/{app,components}/**/*.test.js',
    '!' + paths.src + '/{app,components}/**/*.mock.js'
  ]).pipe($.angularFilesort());

  var injectWorker = gulp.src(['../bower_components/ng-webworker/src/ng-webworker.js', '../bower_components/ng-webworker/src/worker_wrapper.js'])
      .pipe(uglify());

  var injectOptions = {
    ignorePath: [paths.src, paths.tmp + '/serve'],
    addRootSlash: false
  };

  var wiredepOptions = {
    directory: 'bower_components',
    exclude: [/bootstrap\.css/, /foundation\.css/,/font-awesome.css/],
    overrides: {
      angular: {
        dependencies: {
          jquery: '*'
        }
      }
    }
  };

  return gulp.src(paths.src + '/*.html')
    .pipe($.inject(injectStyles, injectOptions))
    .pipe($.inject(series(injectVendor, injectScripts,injectWorker), injectOptions))
    .pipe(wiredep(wiredepOptions))
    .pipe(gulp.dest(paths.tmp + '/serve'));

});
