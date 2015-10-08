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
      $scope.hideTags = false;
      $scope.task = 'update';

      $scope.submit = function() {
        $http.patch(`/api/applicants/${id}`, $scope.applicant)
          .then(function(response) {
            console.log(response);
          },
          function(response) {
            console.log(response);
          });
      };

      if (id !== '') {
        $http.get(`/api/applicants/${id}`)
          .then(response => {
            $scope.applicant = response.data;
            $scope.applicant.dob = new Date($scope.applicant.dob);
          });
      }
    },
  ]);
