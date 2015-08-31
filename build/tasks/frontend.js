'use strict';

var gulp = require('gulp');
var spawn = require('child_process').spawn;
var runSequence = require('run-sequence');
var browserSync = require('browser-sync').create();
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var glob = require('glob');
var SHELTR = require(__base + '/package.json').sheltr;

gulp.task('frontend:browserify', function(cb) {
  glob(SHELTR.srcDir + '/public/scripts/app.js', {}, function(err, files) {
    var b = browserify();
    files.forEach(function(file) {
      b.add(file);
    });
    b.bundle()
     .pipe(source('app.js'))
     .pipe(gulp.dest(SHELTR.distDir + '/public/scripts'));

    cb();
  });
});

gulp.task('frontend:sass', function() {
  return gulp.src(SHELTR.srcDir + '/public/styles/**/*.scss')
    .pipe($.sourcemaps.init())
    .pipe($.sass().on('error', $.sass.logError))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest(SHELTR.distDir + '/public/styles'));
});

gulp.task('frontend:copy', function() {
  return gulp.src([
      SHELTR.srcDir + '/public/**/*',
      '!' + SHELTR.srcDir + '/public/styles/*',
      '!' + SHELTR.srcDir + '/public/scripts/**/*',
    ], { base: '.' })
    .pipe(gulp.dest(SHELTR.distDir));
});
