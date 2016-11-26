angular
  .module('andiApp')
  .controller('dataEntryController', dataEntryController);

dataEntryController.$inject = [
  '$rootScope', '$scope', '$location', '$timeout', '$uibModal', '$q',
  'patientDataservice', 'testTableService', 'ocpuService', 'dataUploadService',
  '$window', 'ivhTreeviewMgr', 'DATEFORMAT', 'toastr'
];

function dataEntryController($rootScope, $scope, $location, $timeout,
  $uibModal, $q, patientDataservice, testTableService, ocpuService, dataUploadService,
  $window, ivhTreeviewMgr, DATEFORMAT, toastr) {
  var dataEntry = this;

  // $rootScope.tests: object containing data about tests that can be selected (a tree of all available tests)
  $rootScope.tests = ($rootScope.tests !== undefined) ? $rootScope.tests : [];
  $rootScope.txtvalue = ($rootScope.txtvalue !== undefined) ? $rootScope.txtvalue : '';

  dataEntry.alertMessage = '';
  dataEntry.submited = false; // for custom validation flag

  // Make selected test object
  // $rootScope.selectedTest: object containg tests selected by the user
  $rootScope.selectedTest = ($rootScope.selectedTest !== undefined) ? $rootScope.selectedTest : {};

  // Patient List
  dataEntry.patient = [];
  dataEntry.patient.push(patientDataservice.addPatient($rootScope.selectedTest));

  $rootScope.nodeArr = ($rootScope.nodeArr !== undefined) ? $rootScope.nodeArr : [];
  $scope.message = 'Data Uploaded successfully.';
  $rootScope.fileErr = false;

  dataEntry.go = function (path) {
    $location.path(path);
  };

  /*
  *Add Patient* button event
  When user clicks *Add patient* button
  new object is being pushed to the patient array
  */
  dataEntry.addPatient = function () {
    dataEntry.patient.push(patientDataservice.addPatient($rootScope.selectedTest));
  };

  dataEntry.removeColumn = function (index, event) {
    // remove the column specified in index
    dataEntry.patient.splice(index, 1);
    event.preventDefault();
  };

  /*
  Verify if patient IDs are unique.
  */
  dataEntry.verifyId = function () {
    console.log('verifyId');
    var sorted = [];
    for (var i in dataEntry.patient) {
      console.log(i);
      if (dataEntry.patient[i].id !== null && dataEntry.patient[i].id !== '' && dataEntry.patient[i].id !== undefined) {
        if (sorted.indexOf(dataEntry.patient[i].id) >= 0) {
          $scope.patientForm['id' + i].$setValidity('duplicate', !true);
        }
        else {
          sorted.push(dataEntry.patient[i].id);
          $scope.patientForm['id' + i].$setValidity('duplicate', !false);
        }
      }
    }
  };

  /*
   * Disable/enable input fields for computed variables/intermediary variables
   */
  dataEntry.disableIntermediaryAndComputedVariables = function(testName, fieldId, patientId) {
    // testName: the name of the test for which a value was added, changed, or removed
    // fieldId: the name of the input field in which a value was added, changed, or removed
    // patientId: the index of the patient for which a value was added, changed, or removed
    var computedVarArgs;
    var useTest;
    var value = $scope.patientForm[fieldId].$viewValue;

    console.log(testName);
    console.log(fieldId);
    console.log(patientId);

    if($rootScope.selectedTestsWithComputedVarArguments[testName].intermediary){
      useTest = $rootScope.selectedTestsWithComputedVarArguments[testName].intermediaryValueFor;
      computedVarArgs = $rootScope.selectedTestsWithComputedVarArguments[useTest].computed_variable_arguments.split(',');

      // check whether either all intermediary values are empty or filled
      var allEmpty = true;
      var allFilled = true;
      var args = [];
      computedVarArgs.forEach(function(arg){
        var v = $scope.patientForm['test'+patientId+'_'+arg].$viewValue;
        if(v){
          allEmpty = false;
          args.push(v);
        } else {
          allFilled = false;
        }
        if(!allFilled){
          dataEntry.patient[patientId][useTest] = '';
        }
      });

      if(value){
        // an intermediary value was added (or changed); disable the input field for the computed variable
        $rootScope.selectedTestsWithComputedVarArguments[useTest].disabled = true;
        if(allFilled){
          // all intermediary values required for calculating the computed value are available
          // so, calculate the computed value
          var input = {'compVar': useTest, 'args': args};
          ocpuService.calccomposite(input).then(function (data) {
            dataEntry.patient[patientId][useTest] = data.data.data.value;
          });
        }
      } else {
        // an intermediary value was removed
        if(allEmpty){
          // all intermediary values are empty, enable the input field for the computed value
          useTest = $rootScope.selectedTestsWithComputedVarArguments[testName].intermediaryValueFor;
          $rootScope.selectedTestsWithComputedVarArguments[useTest].disabled = false;
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
            $rootScope.selectedTestsWithComputedVarArguments[arg].disabled = true;
          } else {
            // a computed value was removed; enable the input fields for the intermediary values
            $rootScope.selectedTestsWithComputedVarArguments[arg].disabled = false;
          }
        });
      }
    }
  };

  /*
  Submit form and move to results page.
  */
  dataEntry.submit = function (isValid) {
    // check if form is valid
    if ($scope.patientForm.$invalid) {
      $scope.dataEntry.submited = true;
    }
    else {
      $scope.dataEntry.submited = true;
      $rootScope.submitData = patientDataservice.submitPatient($scope);
      $location.path('/results');
    }
  };

  // Code executed by the controller.
  // FIXIT: this code is about importing ata from the uploaded file.
  // FIXIT: shoudl get it's own controller / service
  if ($rootScope.fileData !== undefined && $rootScope.fileData !== null && $rootScope.fileData !== '') {
    var replacearr = $rootScope.txtvalue.split(',');
    dataUploadService.upload($rootScope.fileData, replacearr);
  }

  $scope.$on('csvUploaded', function(event, patients){
    dataEntry.patient = patients;

    console.log('patients');
    console.log(patients);

    // Update info about selected tests (from the uploaded csv file)
    $rootScope.nodeArr = [];
    $rootScope.selectedTest = {};

    console.log('loop over tests');
    _.forOwn(patients[0], function(value, key){
      var testFromTree = testTableService.findTest(key, 'id');
      if (testFromTree && testFromTree.id !== null && testFromTree.id !== undefined) {
        $rootScope.selectedTest[key] = testFromTree;
        if ($rootScope.nodeArr.indexOf(key) < 0) {
          $rootScope.nodeArr.push(key);
        }
      }

      // update which tests are selected in the tree data structure
      ivhTreeviewMgr.selectEach($rootScope.tests, $rootScope.nodeArr);
    });
  });
}
