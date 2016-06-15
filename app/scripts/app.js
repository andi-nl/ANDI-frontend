'use strict';
/**
 * @ngdoc overview
 * @name andiApp
 * @description
 * # andiApp
 *
 * Main module of the application.
 */
var app = angular.module('andiApp', [
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
  'treeGrid',
  'ngTableToCsv'
]);

app.constant('defaultFolder', '2016-01-14');

//Setting Routing Url
app.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      redirectTo: '/test-selection'
    })
    .when('/test-selection', {
      templateUrl: 'views/test-selection.html',
      controller: 'treeController',
      controllerAs: 'treeCtrl'
    })
    .when('/data-entry', {
      templateUrl: 'views/data-entry.html',
      controller: 'treeController',
      controllerAs: 'treeCtrl'
    })
    .when('/results', {
      templateUrl: 'views/results.html',
      controller: 'treeController',
      controllerAs: 'treeCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
});
