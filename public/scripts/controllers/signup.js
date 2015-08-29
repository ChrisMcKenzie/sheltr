'use strict';

var MODULE = 'sheltr.controllers.signup';

module.exports = MODULE;

angular.module(MODULE, [])
  .controller('SignupController', ['$scope', '$stateParams', function($scope, $stateParams){
    var inputs = document.querySelectorAll('.field__input');

    Array.prototype.forEach.call(inputs, function(input){
      if(input.dataset.boundToCheckbox) {
        var bindings = input.dataset.boundToCheckbox.split(' ');
        bindings.forEach(function(row){
          var boundInput = document.querySelector('#' + row);
          input.addEventListener('change', function(){
            if(input.value !== '' && input.value !== '0') {
              boundInput.checked = true;
            } else {
              boundInput.checked = false;
            }
          });
        });
      }

      input.addEventListener('focus', function(){
        input.parentElement.classList.add('focus');
      });
      input.addEventListener('blur', function(){
        input.parentElement.classList.remove('focus');
      });
    });
  }]);
