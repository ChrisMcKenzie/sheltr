'use strict';

global.__base = __dirname;
global.$ = require('gulp-load-plugins')();

require('require-dir')('build/tasks');
