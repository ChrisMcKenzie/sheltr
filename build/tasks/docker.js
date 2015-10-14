'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');
var SHELTR = require(__base + '/package.json').sheltr;
var argv = require('yargs').argv;

gulp.task('docker:build', $.shell.task([
  'docker build -t sheltr .',
], {
  cwd: SHELTR.srcDir,
}));

gulp.task('docker:deploy', $.shell.task([
  'docker tag -f sheltr ' + argv.remote,
  'docker push ' + argv.remote,
], {
  cwd: SHELTR.srcDir,
}));
