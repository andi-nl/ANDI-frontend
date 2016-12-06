'use strict';

angular
  .module('andiApp')
  .controller('dataEntryController', dataEntryController);

dataEntryController.$inject = [
  '$rootScope', '$scope', '$location', '$timeout', '$uibModal', '$q',
  'patientDataservice', 'testTableService', 'ocpuService', 'dataUploadService',
  '$window', 'ivhTreeviewMgr', 'toastr'
];

function dataEntryController($rootScope, $scope, $location, $timeout,
  $uibModal, $q, patientDataservice, testTableService, ocpuService, dataUploadService,
  $window, ivhTreeviewMgr, toastr) {
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
  dataEntry.verifyId = function() {
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
  dataEntry.disableIntermediaryAndComputedVariables = function(testName, patient) {
    patientDataservice.disableIntermediaryAndComputedVariables(testName, patient);
  };

  /*
  Submit form and move to results page.
  */
  dataEntry.submit = function() {
    dataEntry.verifyId();
    if ($scope.patientForm.$invalid) {
      $scope.dataEntry.submited = true;
      toastr.error('Required fields are missing. Please check the patient data you are submitting.');
    }
    else {
      $scope.dataEntry.submited = true;
      $rootScope.submitData = patientDataservice.submitPatient($scope.patientData.conf, $scope.patientData.sig, dataEntry.patient);
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
