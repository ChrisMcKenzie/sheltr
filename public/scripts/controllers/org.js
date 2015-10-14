'use strict';

var MODULE = 'sheltr.controllers.org';

function afterShowAnimation($scope, $element, $options) {
  var input = $element.children().find('input')[0];
  input.focus();
}

angular.module(MODULE, ['ngMaterial'])
  .controller('OrgController', [
    '$scope',
    '$state',
    '$mdDialog',
    '$mdToast',
    'Organization',
    'Account',
    function($scope, $state, $mdDialog, $mdToast, Organization, Account) {
      Organization.GetOrganization().then(function(response) {
        $scope.org = response.data;
      });

      Account.getProfile().then(function(response) {
        $scope.user = response.data;
      });

      Account.getProfiles().then(function(response) {
        $scope.users = response.data;
      });

      $scope.deleteUser = function(id) {
        var user = $scope.users[id];

        Account.deleteProfile(user.id).then(function(response) {
          $mdToast.show(
            $mdToast.simple().content('User successfully deleted')
          );
          $scope.users.splice(id, 1);
        });
      };

      $scope.openCreateProfile = function(ev) {
        $mdDialog.show({
          controller: 'ProfileDialogController',
          templateUrl: '/views/profile.form.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: true,
          onComplete: afterShowAnimation,
        });
      };
    },
  ])
  .controller('ProfileDialogController', [
    '$scope',
    '$mdDialog',
    '$mdToast',
    'Account',
    function($scope, $mdDialog, $mdToast, Account) {
      $scope.cancel = function() {
        $mdDialog.cancel();
      };

      $scope.createUser = function() {
        Account.createProfile($scope.user).then(function(response) {
          if (response.status === 201) {
            $mdToast.show(
              $mdToast.simple().content('User successfully created')
            );
            $mdDialog.hide();
          }
        });
      };
    },
  ]);

module.exports = MODULE;

