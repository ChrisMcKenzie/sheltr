'use strict';

var MODULE = 'sheltr.services.organization';

module.exports = MODULE;

angular.module(MODULE, [])
.factory('Organization', function($http) {
    return {
      GetOrganization: function() {
        return $http.get('/api/organization/');
      },
    };
  });
