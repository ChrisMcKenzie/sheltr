'use strict';

var MODULE = 'sheltr.controllers.applicant';

module.exports = MODULE;

angular.module(MODULE, ['ngMaterial'])
  .controller('ApplicantController', [
    '$scope',
    '$http',
    '$stateParams',
    '$state',
    '$mdToast',
    function($scope, $http, $stateParams, $state, $mdToast) {
      var id = $scope.id = $stateParams.id;
      $scope.hideTags = false;
      $scope.task = 'update';

      $scope.submit = function() {
        $http.patch(`/api/applicants/${id}`, $scope.applicant)
          .then(function(response) {
            $mdToast.show(
              $mdToast.simple().content('Applicant successfully updated.')
            );
          },
          function(response) {
            $mdToast.show(
              $mdToast.simple().content('Unable to insert application.')
            );
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
