'use strict';
//test data goes here
/**
 * @ngdoc function
 * @name andiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the andiApp
 */
/*
  @name andiApp.controller:plotController
  @description : put third tab chart event
*/
app.controller('plotController', function ($scope, ocpuService) {

  this.render = function () {
    var patientObj = $scope.$parent.submitData;
    ocpuService.normcomp(patientObj).then(function (data) {
      var normcompData = JSON.parse(data);
      plot(normcompData);
    });
  };

  this.plot = function (normcompData) {

  };

  this.render();

});
