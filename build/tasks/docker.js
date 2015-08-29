'use strict';
/* globals __base, $ */

var gulp = require('gulp');
var runSequence = require('run-sequence');
var SHELTR = require(__base + '/package.json').sheltr;

gulp.task('docker:build', $.shell.task([
  'docker build -t sheltr .'
], {
  cwd: SHELTR.srcDir
}));
