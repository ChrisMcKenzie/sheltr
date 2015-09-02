'use strict';

var MODULE = 'sheltr.controllers.applicant';

module.exports = MODULE;

angular.module(MODULE, [])
  .controller('ApplicantController', [
    '$scope',
    '$http',
    '$stateParams',
    function($scope, $http, $stateParams) {
      $scope.id = $stateParams.id;
    },
  ]);
