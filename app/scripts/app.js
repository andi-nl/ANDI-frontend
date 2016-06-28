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

app.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      redirectTo: '/test-selection'
    })
    .when('/test-selection', {
      templateUrl: 'views/test-selection.html',
      controller: 'testSelectionController',//'treeController',
      controllerAs: 'testSelection'
    })
    .when('/data-entry', {
      templateUrl: 'views/data-entry.html',
      controller: 'dataEntryController',//'treeController',
      controllerAs: 'dataEntry'
    })
    .when('/results', {
      templateUrl: 'views/results.html',
      controller: 'plotController',
      controllerAs: 'plotCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
})
  .constant('defaultFolder', '2016-01-14')
  .constant('DATEFORMAT', 'dd-MM-yyyy');
