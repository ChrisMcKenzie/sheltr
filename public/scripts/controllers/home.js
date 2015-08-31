'use strict';

var MODULE = 'sheltr.controllers.home';

angular.module(MODULE, [])
  .controller('HomeController', [
    '$scope',
    '$state',
    'Applicants',
    function($scope, $state, Applicants) {
      $scope.seekers = [];

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

