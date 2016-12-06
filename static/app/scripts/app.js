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
  'toastr',
  'angularSpinner'
]);

app.config(function ($routeProvider, $compileProvider) {
  $routeProvider
    .when('/', {
      redirectTo: '/test-selection'
    })
    .when('/test-selection', {
      templateUrl: 'static/app/views/test-selection.html',
      controller: 'testSelectionController', // 'treeController',
      controllerAs: 'testSelection'
    })
    .when('/data-entry', {
      templateUrl: 'static/app/views/data-entry.html',
      controller: 'dataEntryController', // 'treeController',
      controllerAs: 'dataEntry'
    })
    .when('/results', {
      templateUrl: 'static/app/views/results.html',
      controller: 'plotController',
      controllerAs: 'plotCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|data):/);
})
  .constant('DATEFORMAT', 'dd-MM-yyyy');
