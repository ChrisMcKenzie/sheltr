'use strict';
var angular = require('angular');
var satellizer = require('satellizer');

angular.module('sheltrApp', [
  require('angular-ui-router'),
  require('./controllers'),
  require('./services'),
  'satellizer',
])
  .run([
    '$rootScope',
    '$state',
    '$stateParams',
    function($rootScope, $state, $stateParams) {
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;
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
