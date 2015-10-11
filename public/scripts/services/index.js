'use strict';

var MODULE = 'sheltr.services';

module.exports = MODULE;

angular.module(MODULE, [
  require('./applicants'),
  require('./account'),
]);
