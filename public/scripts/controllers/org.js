'use strict';

var MODULE = 'sheltr.controllers.org';

angular.module(MODULE, [])
  .controller('OrgController', [
    '$scope',
    '$state',
    'Organization',
    'Account',
    function($scope, $state, Organization, Account) {
      Organization.GetOrganization().then(function(response) {
        $scope.org = response.data;
      });

      Account.getProfile().then(function(response) {
        $scope.user = response.data;
      })
      .catch(function(response) {
        console.log(response);
      });

      Account.getProfiles().then(function(response) {
        $scope.users = response.data;
      });
    },
  ]);

module.exports = MODULE;

