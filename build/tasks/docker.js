'use strict';
/* globals __base, $ */

var gulp = require('gulp');
var runSequence = require('run-sequence');
var SHELTR = require(__base + '/package.json').sheltr;

gulp.task('docker:build', ['docker:copy'], $.shell.task([
  'docker build -t sheltr .'
], {
  cwd: SHELTR.distDir
}));

gulp.task('docker:copy', function(){
  return gulp.src(['./build/files/Dockerfile', 'package.json'])
          .pipe(gulp.dest(SHELTR.distDir));
});
