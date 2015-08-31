'use strict';

var MODULE = 'sheltr.services.applicants';

module.exports = MODULE;

angular.module(MODULE, [])
  .filter('fullname', function() {
    return function(name) {
      return name.first + ' ' + name.last;
    };
  })
  .factory('Applicants', [
    '$http',
    function($http) {
      function request(method) {
        var options = angular.isObject(arguments[1]) ?
          arguments[1] : arguments[2];

        var id = !angular.isObject(arguments[1]) ? arguments[1] : '';

        var url = id === '' ? '/api/applicants' : '/api/applicants/' + id;

        return $http[method](url, options);
      }

      function GetAllSeekers(params) {
        return request('get', {
          params: angular.extend({
            type: 'seeker',
          }, params),
        });
      }

      function GetAllProviders(params) {
        return request('get', {
          params: angular.extend({
            type: 'provider',
          }, params),
        });
      }

      return {
        seekers: {
          getAll: GetAllSeekers,
        },
        providers: {
          getAll: GetAllProviders,
        },
      };
    },
  ]);
