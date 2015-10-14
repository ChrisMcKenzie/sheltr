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
    '$mdToast',
    function($scope, $http, $auth, $location, $stateParams, $mdToast) {
      $scope.login = function() {
        $auth.login($scope.user)
          .then(function() {
            $location.path('/');
          })
          .catch(function(response) {
            $mdToast.show(
              $mdToast.simple().content(response.data.message)
            );
          });
      };
    },
  ]);
