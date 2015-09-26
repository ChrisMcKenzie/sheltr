'use strict';
var angular = require('angular');
var satellizer = require('satellizer');
var material = require('angular-material');

angular.module('sheltrApp', [
  require('angular-ui-router'),
  require('./controllers'),
  require('./services'),
  'ngMaterial',
  'satellizer',
])
  .constant('mapboxKey', 'pk.eyJ1IjoiY2hyaXNtY2tlbnppZSIsImEiOiJ' +
      'jaWV5cHhpYTYwbDkzc2hrcnluc2x1MHFkIn0.S6Jl9xae40JH-GtwOckRrw')
  .run([
    '$rootScope',
    '$state',
    '$stateParams',
    '$auth',
    function($rootScope, $state, $stateParams, $auth) {
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
    'mapboxKey',
    function(
      $stateProvider,
      $authProvider,
      $urlRouterProvider,
      mapboxKey) {

      L.mapbox.accessToken = mapboxKey;

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
          url: '/signup/:type',
          templateUrl: 'views/signup.form.html',
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
        });
    },
  ]);
