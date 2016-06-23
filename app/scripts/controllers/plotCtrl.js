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
  //call during secont tab next button click time
  $scope.$on('MoveToChart', function (e) {
    $scope.plotCtrl.draw();
  });
  /* Chart options */
  this.draw = function () {

    var patientObj = $scope.$parent.submitData;
    ocpuService.normcomp(patientObj)
  };
});
