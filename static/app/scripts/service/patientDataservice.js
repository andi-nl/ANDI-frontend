'use strict';
angular
  .module('andiApp')
  .factory('patientDataservice', patientDataservice);

patientDataservice.$inject = ['testTableService', '$rootScope'];

function patientDataservice(testTableService, $rootScope) {
  var limit = 0;
  var patientObj = {};
  var d1 = '';
  var d2 = '';
  var yrs = '';
  var years = '';
  return {
    addPatient: addPatient,
    submitPatient: submitPatient
  };
  function addPatient(selectedTest) {
    var patient = { 'id': '', 'age': '', 'sex': '', 'education': '' };
    _.forOwn(selectedTest, function(value, key){
      patient[key] = '';
    });
    console.log(patient);
    return patient;
  }
  function submitPatient($scope) {
    // TODO: don't use $scope.patient
    // TODO: dont' use $scope.dataEntry.counter
    // make Patient Object
    limit = 0;
    patientObj.settings = {
      conf: $scope.patientData.conf,
      sig: $scope.patientData.sig,
      normative: $rootScope.nomative,
      chart: ''
    };
    patientObj.patientScores = [];
    for (var i in $scope.patient) {
      if (limit < $scope.dataEntry.counter) {
        var patientTest = {
          id: $scope.patient[i].id,
          age: $scope.patient[i].age,
          sex: $scope.patient[i].sex,
          education: $scope.patient[i].education,
          test: []
        };
        angular.forEach($scope.nodeArr, function (nodeval, nodekey) {
          var labelField = testTableService.findTest(nodeval, 'id');
          patientTest.test.push({
            id: nodeval,
            label: labelField.label,
            Dataset: labelField.Dataset,
            'SPSS name': labelField['SPSS name'],
            highborder: labelField.highborder,
            highweb: labelField.highweb,
            lowborder: labelField.lowborder,
            lowweb: labelField.lowweb,
            value: ($scope.patient[i].test !== undefined && $scope.patient[i].test[nodeval] !== undefined && $scope.patient[i].test[nodeval] !== null && $scope.patient[i].test[nodeval] !== '') ? $scope.patient[i].test[nodeval] : 999999999
          });
        });
        patientObj.patientScores.push(patientTest);
        limit++;
      }
    }
    return patientObj;
  }
};
