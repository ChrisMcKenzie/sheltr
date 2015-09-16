'use strict';

var MODULE = 'sheltr.controllers';

module.exports = MODULE;

angular.module(MODULE, [
  require('./home'),
  require('./signup'),
  require('./applicant'),
  require('./login'),
]);
