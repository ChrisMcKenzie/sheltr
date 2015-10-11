'use strict';

var MODULE = 'sheltr.controllers.home';

angular.module(MODULE, [])
  .controller('HomeController', [
    '$scope',
    '$state',
    'Applicants',
    'Account',
    function($scope, $state, Applicants, Account) {
      $scope.seekers = [];

      Account.getProfile().then(function(response) {
        $scope.user = response.data;
      })
      .catch(function(response) {
        console.log(response);
      });

      Applicants.seekers.getAll({
        limit: 10,
      })
      .then(function(response) {
        $scope.seekers = response.data;
      }, function() {
        // Handle errors
      });


      Applicants.providers.getAll({
        limit: 10,
      })
      .then(function(response) {
        $scope.providers = response.data;
      }, function() {
        // Handle errors
      });
    },
  ]);

module.exports = MODULE;

