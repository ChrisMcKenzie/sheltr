'use strict';

var gulp = require('gulp');
var spawn = require('child_process').spawn;
var SHELTR = require(__base + '/package.json').joog;

gulp.task('setup', ['setup:bower', 'setup:addGitHooks']);

// Install/update bower components.
gulp.task('setup:bower', function(cb) {
  var proc = spawn(__base + '/node_modules/bower/bin/bower', ['install'], {cwd: __base, stdio: 'inherit'});
  proc.on('close', cb);
});

gulp.task('setup:addGitHooks', function(){
  return gulp.src([__base + '/build/utils/pre-commit'])
    .pipe($.chmod(755))
    .pipe(gulp.dest('.git/hooks'));
})

