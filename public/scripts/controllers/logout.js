'use strict';

var MODULE = 'sheltr.controllers.logout';

module.exports = MODULE;

angular.module(MODULE, [])
  .controller('LogoutController', [
    '$auth',
    '$location',
    function($auth, $location) {
      if (!$auth.isAuthenticated()) { return; }
      $auth.logout()
        .then(function() {
          $location.path('/');
        });
    },
  ]);
