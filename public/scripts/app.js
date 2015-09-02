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
    '$urlRouterProvider',
    '$authProvider',
    function($stateProvider, $urlRouterProvider, $authProvider) {
      $urlRouterProvider.otherwise('/');

      $authProvider.loginUrl = '/api/authenticate';

      $stateProvider
        .state('signup', {
          url: '/signup/:type',
          templateUrl: 'views/signup.form.html',
          controller: 'SignupController',
        })

        .state('home', {
          url: '/',
          templateUrl: 'views/home.html',
          controller: 'HomeController',
        })

        .state('applicant', {
          url: '/applicants/:id',
          templateUrl: 'views/applicant.view.html',
          controller: 'ApplicantController',
        });
    },
  ]);
