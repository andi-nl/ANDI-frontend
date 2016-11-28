'use strict';
angular
  .module('andiApp')
  .factory('patientDataservice', patientDataservice);

patientDataservice.$inject = ['testTableService', '$rootScope', 'ocpuService', 'toastr'];

function patientDataservice(testTableService, $rootScope, ocpuService, toastr) {
  var limit = 0;
  var patientObj = {};

  return {
    addPatient: addPatient,
    submitPatient: submitPatient,
    disableIntermediaryAndComputedVariables: disableIntermediaryAndComputedVariables
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
        angular.forEach($scope.nodeArr, function (nodeval) {
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

  function disableIntermediaryAndComputedVariables(testName, patient) {
    // testName: the name of the test for which a value was added, changed, or removed
    // patient: patient object for which a value was added, changed, or removed
    var computedVarArgs;
    var useTest;
    var value = patient[testName];

    //console.log(testName);
    //console.log(patient);
    //console.log(value);

    if($rootScope.selectedTestsWithComputedVarArguments[testName].intermediary){
      useTest = $rootScope.selectedTestsWithComputedVarArguments[testName].intermediaryValueFor;
      computedVarArgs = $rootScope.selectedTestsWithComputedVarArguments[useTest].computed_variable_arguments.split(',');

      // check whether either all intermediary values are empty or filled
      var allEmpty = true;
      var allFilled = true;
      var args = [];
      computedVarArgs.forEach(function(arg){
        var v = patient[arg];
        if(v){
          allEmpty = false;
          args.push(v);
        } else {
          allFilled = false;
        }
        if(!allFilled){
          patient[useTest] = '';
        }
      });

      if(value){
        // an intermediary value was added (or changed); disable the input field for the computed variable
        patient[useTest+'_disabled'] = true;

        if(patient[useTest] !== ''){
          toastr.warning('Patient '+patient.id+': Intermediary value "'+testName+'" provided, removing value for '+useTest+'.');
          patient[useTest] = '';
        }
        if(allFilled){
          // all intermediary values required for calculating the computed value are available
          // so, calculate the computed value
          var input = {'compVar': useTest, 'args': args};
          ocpuService.calccomposite(input).then(function (data) {
            patient[useTest] = data.data.data.value;
          });
        }
      } else {
        // an intermediary value was removed
        if(allEmpty){
          // all intermediary values are empty, enable the input field for the computed value
          useTest = $rootScope.selectedTestsWithComputedVarArguments[testName].intermediaryValueFor;
          patient[useTest+'_disabled'] = false;
        }
      }
    } else {
      // we are not dealing with a value for an intermediary variable
      // check to see whether we are dealing with a value for a computed variable
      computedVarArgs = $rootScope.selectedTestsWithComputedVarArguments[testName].computed_variable_arguments.split(',');
      if(computedVarArgs[0] !== ""){
        computedVarArgs.forEach(function(arg){
          if(value){
            // a computed value was filled in; disable the input fields for the intermediary values
            patient[arg+'_disabled'] = true;
          } else {
            // a computed value was removed; enable the input fields for the intermediary values
            patient[arg+'_disabled'] = false;
          }
        });
      }
    }
  }
}
