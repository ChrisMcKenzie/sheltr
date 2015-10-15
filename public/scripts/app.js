'use strict';
var angular = require('angular');
var angularMessages = require('angular-messages');
var satellizer = require('satellizer');
var material = require('angular-material');

angular.module('sheltrApp', [
  require('angular-ui-router'),
  require('./controllers'),
  require('./services'),
  'ngMaterial',
  'ngMessages',
  'satellizer',
])
  .run([
    '$animate',
    '$rootScope',
    '$state',
    '$stateParams',
    '$auth',
    function($animate, $rootScope, $state, $stateParams, $auth) {
      $animate.enabled(true);
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;
      $rootScope.isAuthenticated = function() {
        return $auth.isAuthenticated();
      };
    },
  ])
  .config([
    '$stateProvider',
    '$authProvider',
    '$urlRouterProvider',
    function(
      $stateProvider,
      $authProvider,
      $urlRouterProvider) {

      $urlRouterProvider.otherwise('/login');

      $authProvider.tokenPrefix = 'sheltr';
      $authProvider.loginUrl = '/api/authenticate';

      function skipIfLoggedIn($q, $auth) {
        var deferred = $q.defer();
        if ($auth.isAuthenticated()) {
          deferred.reject();
        } else {
          deferred.resolve();
        }
        return deferred.promise;
      }

      function loginRequired($q, $location, $auth) {
        var deferred = $q.defer();
        if ($auth.isAuthenticated()) {
          deferred.resolve();
        } else {
          $location.path('/login');
        }
        return deferred.promise;
      }

      function isAuthorized(permission) {
        return function($q, $location, $auth) {
          var deferred = $q.defer();
          var payload = $auth.getPayload();
          if (payload[permission]) {
            deferred.resolve();
          } else {
            $location.path('/');
          }
          return deferred.promise;
        };
      }

      $stateProvider
        .state('login', {
          url: '/login',
          templateUrl: 'views/login.form.html',
          controller: 'LoginController',
          resolve: {
            skipIfLoggedIn: skipIfLoggedIn,
          },
        })

        .state('logout', {
          url: '/logout',
          template: null,
          controller: 'LogoutController',
          resolve: {
            loginRequired: loginRequired,
          },
        })

        .state('signup', {
          url: '/applicants/new',
          templateUrl: 'views/applicant.view.html',
          controller: 'SignupController',
          resolve: {
            loginRequired: loginRequired,
          },
        })

        .state('home', {
          url: '/',
          templateUrl: 'views/home.html',
          controller: 'HomeController',
          resolve: {
            loginRequired: loginRequired,
          },
        })

        .state('applicant', {
          url: '/applicants/:id',
          templateUrl: 'views/applicant.view.html',
          controller: 'ApplicantController',
          resolve: {
            loginRequired: loginRequired,
          },
        })

        .state('organization', {
          url: '/organization',
          templateUrl: 'views/org.view.html',
          controller: 'OrgController',
          resolve: {
            adminRequired: isAuthorized('admin'),
          },
        });
    },
  ]);
