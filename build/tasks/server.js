'use strict';
/* globals __base, $ */

var gulp = require('gulp');
var spawn = require('child_process').spawn;
var runSequence = require('run-sequence');
var browserSync = require('browser-sync').create();
var SHELTR = require(__base + '/package.json').sheltr;
var path = require('path');

gulp.task('server:compile', function () {
  return gulp.src([
      SHELTR.srcDir + '/src/**/*.js',
      SHELTR.srcDir + '/app.js'
    ], { base: '.' })
    .pipe($.sourcemaps.init())
    .pipe($.babel())
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest(SHELTR.distDir));
});

gulp.task('server:serve', ['server:nodemon'], function(){
  browserSync.init({
      proxy: 'http://localhost:3000',
      files: [
        SHELTR.srcDir + '/public/**/*',
        '!' + SHELTR.srcDir + '/public/bower_components/**/*',
      ],
      port: 3001,
  });
});

gulp.task('server:nodemon', function(cb){
  var started = false;

  return $.nodemon({
    script: SHELTR.distDir + '/app.js',
    tasks: ['server:compile'],
    watch: [
      path.resolve(SHELTR.srcDir + '/src/**/*'),
      path.resolve(SHELTR.srcDir + '/app.js')
    ]
  }).on('start', function(){
    if(!started) {
      cb();
      started = true;
    }
  });
});

