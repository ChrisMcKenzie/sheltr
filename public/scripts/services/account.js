'use strict';

var MODULE = 'sheltr.services.accounts';

module.exports = MODULE;

angular.module(MODULE, [])
.factory('Account', function($http) {
    return {
      getProfile: function() {
        return $http.get('/api/users/me');
      },
      updateProfile: function(profileData) {
        return $http.put('/api/users/me', profileData);
      },
      getProfiles: function() {
        return $http.get('/api/users');
      },
      deleteProfile: function(id) {
        return $http.delete(`/api/users/${id}`);
      },
      createProfile: function(user) {
        return $http.post('/api/users', user);
      },
    };
  });
