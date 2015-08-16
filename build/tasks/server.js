'use strict';

var gulp = require('gulp');
var spawn = require('child_process').spawn;
var runSequence = require('run-sequence');
var browserSync = require('browser-sync').create();
var SHELTR = require(__base + '/package.json').sheltr;
var argv = require('yargs').argv;

gulp.task('server:copy-bin', function(){
  return gulp.src([SHELTR.srcDir + '/bin/*'])
    .pipe($.chmod(755))
    .pipe(gulp.dest(SHELTR.distDir + '/bin'));
});

gulp.task('server:copy-assets', function(){
  return gulp.src([
      SHELTR.srcDir + '/views/**/*',
      SHELTR.srcDir + '/public/**/*'
    ], { base: '.' })
    .pipe(gulp.dest(SHELTR.distDir));
});

gulp.task('server:copy', function(){
  return runSequence(['server:copy-bin', 'server:copy-assets']);
});

gulp.task('server:compile', build);

gulp.task('server:serve', ['server:nodemon'], function(){
  browserSync.init({
      proxy: "http://localhost:3000",
      files: [
        './public/**/*',
        SHELTR.srcDir + '/views/**/*'
      ],
      port: 3001,
  });

  gulp.watch([
      SHELTR.srcDir + '/views/**/*',
      './public/**/*'
    ], [
      'server:copy'
    ],
    browserSync.reload
  );
});

gulp.task('server:nodemon', function(cb){
  var started = false;

  return $.nodemon({
    script: SHELTR.distDir + '/bin/www',
    tasks: ['server:compile', 'server:copy'],
    watch: [SHELTR.srcDir + '/**/*']
  }).on('start', function(){
    if(!started) {
      cb();
      started = true;
    }
  });
});

function build(done){
  return gulp.src([
      SHELTR.srcDir + '/collections/*.js',
      SHELTR.srcDir + '/routes/*.js',
      SHELTR.srcDir + '/*.js'
    ], { base: '.' })
    .pipe($.sourcemaps.init())
    .pipe($.babel())
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest(SHELTR.distDir))
}
