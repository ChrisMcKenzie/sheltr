'use strict';

var MODULE = 'sheltr.controllers.applicant';

module.exports = MODULE;

angular.module(MODULE, [])
  .controller('ApplicantController', [
    '$scope',
    '$http',
    '$stateParams',
    function($scope, $http, $stateParams) {
      var id = $scope.id = $stateParams.id;

      $http.get(`/api/applicants/${id}`)
        .then((response) => {
          $scope.applicant = response.data;
          console.log($scope.applicant);
        });
    },
  ]);
