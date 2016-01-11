'use strict';

/**
 * @ngdoc overview
 * @name andiApp
 * @description
 * # andiApp
 *
 * Main module of the application.
 */
var app =angular.module('andiApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'xeditable',
    'ui.bootstrap',
    'ivh.treeview',
    'ui.ace',
    'chart.js',
    'nvd3'
  ]);

  //Setting for RCtrl

  app.config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/diagnosis.html',
        controller: 'TableController',
        controllerAs: 'diagnosis'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });
      
  });



