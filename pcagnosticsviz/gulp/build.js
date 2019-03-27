'use strict';

var gulp = require('gulp');
var babel = require('gulp-babel');
var header = require('gulp-header');
var uglify = require('gulp-uglify');
var paths = gulp.paths;

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

gulp.task('partials', function () {
  return gulp.src([
    paths.src + '/{app,components}/**/*.html',
    paths.tmp + '/{app,components}/**/*.html'
  ])
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe($.angularTemplatecache('templateCacheHtml.js', {
      module: 'pcagnosticsviz'
    }))
    .pipe(gulp.dest(paths.tmp + '/partials/'));
});

gulp.task('html', ['inject', 'partials','workerinject'], function () {
  var partialsInjectFile = gulp.src(paths.tmp + '/partials/templateCacheHtml.js', { read: false });
  var partialsInjectFile2 = gulp.src(paths.dist + '/scripts/ng-webworker.js', { read: false });
  var partialsInjectOptions = {
    starttag: '<!-- inject:partials -->',
    ignorePath: paths.tmp + '/partials',
    addRootSlash: false
  };var partialsInjectOptions2 = {
    starttag: '<!-- inject:workerinject -->',
    ignorePath: paths.tmp + '/partials',
    addRootSlash: false
  };

  var htmlFilter = $.filter('*.html', {restore: true});
  var jsFilter = $.filter('**/*.js', {restore: true});
  var cssFilter = $.filter('**/*.css', {restore: true});

  return gulp.src(paths.tmp + '/serve/*.html')
      .pipe($.inject(partialsInjectFile2, partialsInjectOptions2))
    .pipe($.inject(partialsInjectFile, partialsInjectOptions))
    .pipe($.useref())
    .pipe(jsFilter)
    .pipe($.ngAnnotate())
    .pipe($.uglify({preserveComments: $.uglifySaveLicense}))
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    .pipe($.base64({
        baseDir: paths.src + '/app/',
        maxImageSize: 1024*1024, // 1MB
    }))
    .pipe($.csso())
    .pipe(cssFilter.restore)
    .pipe(htmlFilter)
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe(htmlFilter.restore)
    .pipe(gulp.dest(paths.dist + '/'))
    .pipe($.size({ title: paths.dist + '/', showFiles: true }));
});

gulp.task('data', function () {
  return gulp.src(paths.src + '/data/*')
    .pipe(gulp.dest(paths.dist + '/data/'));
});

gulp.task('fonts', function () {
  return gulp.src($.mainBowerFiles())
    .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
    .pipe($.flatten())
    .pipe(gulp.dest(paths.dist + '/fonts/'));
});

gulp.task('misc', function () {
  return gulp.src(paths.src + '/**/*.ico')
    .pipe(gulp.dest(paths.dist + '/'));
});

gulp.task('zeroclipboard', function () {
  return gulp.src('bower_components/zeroclipboard/dist/ZeroClipboard.swf')
    .pipe(gulp.dest(paths.dist + '/bower_components/zeroclipboard/dist/'));
});
gulp.task('worker', function() {
    return gulp.src(['bower_components/ng-webworker/src/ng-webworker.js', 'bower_components/ng-webworker/src/worker_wrapper.js'])
        .pipe(uglify())
        .pipe(gulp.dest(paths.dist + '/scripts/'));
});
gulp.task('clean', function (done) {
  $.del([paths.dist + '/', paths.tmp + '/'], done);
});

gulp.task('build', ['html', 'data', 'misc', 'zeroclipboard']);
