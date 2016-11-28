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
    return patient;
  }

  function submitPatient(conf, sig, patients) {
    limit = 0;
    patientObj.settings = {
      conf: conf,
      sig: sig,
      normative: $rootScope.nomative,
      chart: ''
    };
    patientObj.patientScores = [];

    var patientTest;

    patients.forEach(function(patient){
      patientTest = {
        id: patient.id,
        age: parseInt(patient.age),
        sex: parseInt(patient.sex),
        education: parseInt(patient.education),
        test: []
      };
      _.forOwn($rootScope.selectedTest, function (test, testName) {
        patientTest.test.push({
          id: testName,
          label: test.label,
          Dataset: test.Dataset,
          'SPSS name': test['SPSS.name'],
          highborder: test.highborder,
          highweb: test.highweb,
          lowborder: test.lowborder,
          lowweb: test.lowweb,
          value: (patient[testName] !== undefined && patient[testName] !== null && patient[testName] !== '') ? patient[testName] : 999999999
        });
      });

      patientObj.patientScores.push(patientTest);
    });

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
        if(!allFilled && !allEmpty){
          if(patient[useTest] !== ''){
            toastr.warning('Patient '+patient.id+': Intermediary value "'+testName+'" provided, removing value for '+useTest+'.');
            patient[useTest] = '';
          }
        }
      });

      if(value){
        // an intermediary value was added (or changed); disable the input field for the computed variable
        patient[useTest+'_disabled'] = true;

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
