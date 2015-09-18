'use strict';

var MODULE = 'sheltr.controllers.login';

module.exports = MODULE;

angular.module(MODULE, [])
  .controller('LoginController', [
    '$scope',
    '$http',
    '$auth',
    '$location',
    '$stateParams',
    function($scope, $http, $auth, $location, $stateParams) {
      $scope.login = function() {
        $auth.login($scope.user)
          .then(function() {
            $location.path('/');
          })
          .catch(function(response) {
            console.error(response);
          });
      };
    },
  ]);
