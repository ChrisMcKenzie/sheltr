'use strict';
/* globals __base */

var gulp = require('gulp');
var runSequence = require('run-sequence');
var del = require('del');
var browserSync = require('browser-sync');
var SHELTR = require(__base + '/package.json').sheltr;

gulp.task('default', function(done){
  runSequence(
    ['server:compile'],
    done
  );
});

gulp.task('serve', function(done){
  runSequence(
    'server:compile',
    ['frontend:copy', 'frontend:sass'],
    'server:serve',
    done
  );

  gulp.watch([
      SHELTR.srcDir + '/public/**/*'
    ], [
      'frontend:copy',
      'frontend:sass'
    ],
    browserSync.reload
  );
});

gulp.task('clean', function(done){
  del([
    SHELTR.distDir
  ], done);
});
