'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');
var del = require('del');
var browserSync = require('browser-sync');
var SHELTR = require(__base + '/package.json').sheltr;

gulp.task('default', ['serve']);

gulp.task('jshint', function(done) {
  return gulp.src([
    SHELTR.srcDir + '/src/**/*.js',
    SHELTR.srcDir + '/public/**/*.js',
  ])
  .pipe($.jshint())
  .pipe($.jshint.reporter('jshint-stylish'));
});

gulp.task('jscs', function(done) {
  return gulp.src([
    SHELTR.srcDir + '/src/**/*.js',
    SHELTR.srcDir + '/public/**/*.js',
  ])
  .pipe($.jscs());
});

gulp.task('dist', function(done) {
  runSequence(
    'server:compile',
    ['frontend:copy', 'frontend:sass', 'frontend:browserify'],
    'docker:build',
    'docker:deploy',
    done
  );
});

gulp.task('serve', function(done) {
  runSequence(
    'server:compile',
    ['frontend:copy', 'frontend:sass', 'frontend:browserify'],
    'server:serve',
    done
  );

  gulp.watch([
      SHELTR.srcDir + '/public/**/*',
    ], [
      'frontend:copy',
      'frontend:sass',
      'frontend:browserify',
    ],
    browserSync.reload
  );
});

gulp.task('clean', function(done) {
  del([
    SHELTR.distDir,
  ], done);
});
