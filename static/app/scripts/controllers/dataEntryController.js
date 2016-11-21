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
  dataEntry.counter = 1;
  dataEntry.shouldCalcAge = true;
  dataEntry.submited = false; // for custom validation flag

  // Make selected test object
  // $rootScope.selectedTest: object containg tests selected by the user
  $rootScope.selectedTest = ($rootScope.selectedTest !== undefined) ? $rootScope.selectedTest : {};

  // Patient List
  dataEntry.patient = [];
  dataEntry.patient.push(patientDataservice.addPatient($rootScope.selectedTest));

  $rootScope.nodeArr = ($rootScope.nodeArr !== undefined) ? $rootScope.nodeArr : [];
  $scope.message = 'Data Uploaded successfully.';
  $scope.validfile = false;
  $rootScope.fileErr = false;
  $scope.format = DATEFORMAT;

  /*
  *Add Patient* button event
  When user clicks *Add patient* button
  new object is being pushed to the patient array
  */
  dataEntry.go = function (path) {
    $location.path(path);
  };

  dataEntry.addPatient = function () {
    dataEntry.patient.push(patientDataservice.addPatient($rootScope.selectedTest));
    dataEntry.counter++;
  };

  /*
     Remove patient from the table.
     Check that at least one patient is present.
  */
  dataEntry.removeColumn = function (index, event) {
    // remove the column specified in index
    // you must cycle all the rows and remove the item
    // row by row
    if (dataEntry.patient.length > 1) {
      dataEntry.patient.splice(index, 1);
      var formObj = $scope.patient.form;
      delete $scope.patient['form'];
      var x = [];
      $.each($scope.patient, function (i, n) {
        x.push(n);
      });
      x.splice(index, 1);
      $scope.patient = x.reduce(function (o, v, i) {
        o[i] = v;
        return o;
      }, {});
      $scope.patient.form = formObj;
      dataEntry.counter--;
      event.preventDefault();
    }
    else {
      // This shouldn't happen anymore, because no delete button is displayed
      // when there is only one patient. However, for overcompleteness, the
      // alert message is kept.
      alert('Data for at least one patient needs to be filled in !');
      event.preventDefault();
    }
  };

  /*
  Verify if patient IDs are unique.
  */
  dataEntry.verifyId = function () {
    var sorted = [];
    for (var i in $scope.patient) {
      if ($scope.patient[i].id !== null && $scope.patient[i].id !== '' && $scope.patient[i].id !== undefined) {
        if (sorted.indexOf($scope.patient[i].id) >= 0) {
          $scope.patient.form['id' + i].$setValidity('duplicate', !true);
        }
        else {
          sorted.push($scope.patient[i].id);
          $scope.patient.form['id' + i].$setValidity('duplicate', !false);
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
    // patientId: the id of the patient for which a value was added, changed, or removed
    var computedVarArgs;
    var useTest;
    var value = $scope.patient.form[fieldId].$viewValue;

    console.log(testName);
    console.log(fieldId);
    console.log(patientId);

    if($rootScope.selectedTest[testName].intermediary){
      useTest = $rootScope.selectedTest[testName].intermediaryValueFor;
      computedVarArgs = $rootScope.selectedTest[useTest].computed_variable_arguments.split(',');

      // check whether either all intermediary values are empty or filled
      var allEmpty = true;
      var allFilled = true;
      var args = [];
      computedVarArgs.forEach(function(arg){
        var v = $scope.patient.form['test'+patientId+'_'+arg].$viewValue;
        if(v){
          allEmpty = false;
          args.push(v);
        } else {
          allFilled = false;
        }
        if(!allFilled){
          $scope.patient[patientId][useTest] = '';
        }
      });

      if(value){
        // an intermediary value was added (or changed); disable the input field for the computed variable
        $rootScope.selectedTest[useTest].disabled = true;
        if(allFilled){
          // all intermediary values required for calculating the computed value are available
          // so, calculate the computed value
          var input = {'compVar': useTest, 'args': args};
          ocpuService.calccomposite(input).then(function (data) {
            $scope.patient[patientId][useTest] = data.data.data.value;
          });
        }
      } else {
        // an intermediary value was removed
        if(allEmpty){
          // all intermediary values are empty, enable the input field for the computed value
          useTest = $rootScope.selectedTest[testName].intermediaryValueFor;
          $rootScope.selectedTest[useTest].disabled = false;
        }
      }
    } else {
      // we are not dealing with a value for an intermediary variable
      // check to see whether we are dealing with a value for a computed variable
      computedVarArgs = $rootScope.selectedTest[testName].computed_variable_arguments.split(',');
      if(computedVarArgs[0] !== ""){
        computedVarArgs.forEach(function(arg){
          if(value){
            // a computed value was filled in; disable the input fields for the intermediary values
            $rootScope.selectedTest[arg].disabled = true;
          } else {
            // a computed value was removed; enable the input fields for the intermediary values
            $rootScope.selectedTest[arg].disabled = false;
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
    if ($scope.patient.form.$invalid) {
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
    var replacearr = $rootScope.txtvalue.split(';');
    dataUploadService.upload($rootScope.fileData, replacearr);
  }

  $scope.$on('csvUploaded', function(event, patients){
    dataEntry.patient = patients;
    $scope.patient = patients;
    // TODO: set sex and education

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
