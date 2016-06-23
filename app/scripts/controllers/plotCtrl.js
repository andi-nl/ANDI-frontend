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
app.controller('plotController', function ($scope, $http, testTableService) {
  //call during secont tab next button click time
  $scope.$on('MoveToChart', function (e) {
    $scope.plotCtrl.FormChart();
  });
  /* Chart options */
  this.FormChart = function () {
    if ($scope.patient.chart === "scatter") { // scatter chart load

    }
    else if ($scope.patient.chart === "radar") { // radar chart load

    }
    else { // defaut chart load
      var patientObj = $scope.$parent.submitData;
      var config = {
        headers: {
          'Content-Type': 'application/json;'
        }
      };
      $http.post('http://145.100.58.103:5000/formTestScores', patientObj, config)
        .success(function (data) {
          console.log(data);
          testTableService.lineChart(data);
        })
        .error(function (data) {
          console.log(data);
        });
    }
  };
});
