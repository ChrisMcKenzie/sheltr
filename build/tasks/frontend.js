'use strict';
/* globals __base, $ */

var gulp = require('gulp');
var spawn = require('child_process').spawn;
var runSequence = require('run-sequence');
var browserSync = require('browser-sync').create();
var SHELTR = require(__base + '/package.json').sheltr;

gulp.task('frontend:sass', function () {
  return gulp.src(SHELTR.srcDir + '/public/styles/**/*.scss')
    .pipe($.sourcemaps.init())
    .pipe($.sass().on('error', $.sass.logError))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest(SHELTR.distDir + '/public/styles'));
});

gulp.task('frontend:copy', function(){
  return gulp.src([
      SHELTR.srcDir + '/public/**/*',
      '!' + SHELTR.srcDir + '/public/styles/*'
    ], { base: '.' })
    .pipe(gulp.dest(SHELTR.distDir));
});
