'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');
var del = require('del');
var SHELTR = require(__base + '/package.json').sheltr;

gulp.task('default', function(done){
  runSequence(
    ['server:copy', 'server:compile'],
    done
  );
});

gulp.task('serve', function(done){
  runSequence(
    ['server:copy', 'server:compile'],
    'server:serve',
    done
  );

  gulp.watch(['app/**/*'], ['server:reload']);
});

gulp.task('clean', function(done){
  del([
    SHELTR.distDir
  ], done)
})
