'use strict';

var gulp = require('gulp');
var spawn = require('child_process').spawn;
var SHELTR = require(__base + '/package.json').joog;

gulp.task('setup', ['setup:addGitHooks']);

gulp.task('setup:addGitHooks', function() {
  return gulp.src([__base + '/build/utils/pre-commit'])
    .pipe($.chmod(755))
    .pipe(gulp.dest('.git/hooks'));
});

