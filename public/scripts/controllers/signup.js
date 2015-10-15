'use strict';

var MODULE = 'sheltr.controllers.signup';

module.exports = MODULE;

angular.module(MODULE, ['ngMaterial'])
  .controller('SignupController', [
    '$scope',
    '$http',
    '$stateParams',
    '$mdToast',
    '$state',
    function($scope, $http, $stateParams, $mdToast, $state) {
      var type = $stateParams.type;
      $scope.hideTags = true;
      $scope.task = 'create';
      var master = {
        type: type,
        filters: {},
        addresses: [{}],
        status: 'new',
      };

      $scope.addAddy = function() {
        $scope.applicant.addresses.push({});
        console.log($scope.applicant);
      };

      $scope.reset = function() {
        $scope.applicant = angular.copy(master);
      };

      $scope.genderPrefs = [
        {name: 'male', value: 'male'},
        {name: 'female', value: 'female'},
      ];

      $scope.smokingPrefs = [
        {name: 'inside', value: 'inside'},
        {name: 'outside', value: 'outside'},
      ];

      $scope.petPrefs = [
        {name: 'inside', value: 'inside'},
        {name: 'outside', value: 'outside'},
        {name: 'none', value: 'none'},
      ];

      $scope.drinkingPrefs = [
        {name: 'occasional', value: 'ocassional'},
        {name: 'everyday', value: 'everyday'},
        {name: 'none', value: 'none'},
      ];

      $scope.submit = function() {
        $http.post('/api/applicants', $scope.applicant)
          .then(function(response) {
            $mdToast.simple().content('Successfully created application.');
          },
          function(response) {
            $mdToast.show(
              $mdToast.simple().content('Unable to insert application.')
            );
          });
      };

      $scope.reset();

      var inputs = document.querySelectorAll('.field__input');

      Array.prototype.forEach.call(inputs, function(input) {
        if (input.dataset.boundToCheckbox) {
          var bindings = input.dataset.boundToCheckbox.split(' ');
          bindings.forEach(function(row) {
            var boundInput = document.querySelector('#' + row);
            input.addEventListener('change', function() {
              if (input.value !== '' && input.value !== '0') {
                boundInput.checked = true;
              } else {
                boundInput.checked = false;
              }
            });
          });
        }

        input.addEventListener('focus', function() {
          input.parentElement.classList.add('focus');
        });
        input.addEventListener('blur', function() {
          input.parentElement.classList.remove('focus');
        });
      });
    },
  ]);
