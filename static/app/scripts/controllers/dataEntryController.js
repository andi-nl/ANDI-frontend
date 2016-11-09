angular
  .module('andiApp')
  .controller('dataEntryController', dataEntryController);

dataEntryController.$inject = [
  '$rootScope', '$scope', '$location', '$timeout', '$uibModal', '$q',
  'patientDataservice', 'testTableService', 'ocpuService',
  '$window', 'ivhTreeviewMgr', 'DATEFORMAT', 'toastr'
];

function dataEntryController($rootScope, $scope, $location, $timeout,
  $uibModal, $q, patientDataservice, testTableService, ocpuService,
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
  console.log($rootScope.selectedTest);

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

  dataEntry.dateRequired = function (index) {
    var valid = false;
    if (($rootScope.fileData === undefined || $rootScope.fileData === null || $rootScope.fileData === '')) {
      if ($scope.patient[index] !== undefined && $scope.patient[index].age !== undefined && $scope.patient[index].age !== '') {
        valid = false;
      }
      else {
        valid = true;
      }
    }
    else {
      if ($scope.patient[index] !== undefined && $scope.patient[index].age === undefined) {
        valid = false;
      }
    }
    return valid;
  };

  /*
  Disable birthdate and testdate input when age input is filled in.
  */
  dataEntry.disableDate = function (index) {
    if ($scope.patient.form['age' + index].$viewValue !== '' && $scope.patient.form['age' + index].$viewValue !== undefined && $scope.patient.form['age' + index].$viewValue !== null) {
      $('#birthdate' + index).attr('disabled', true);
      $('#testdate' + index).attr('disabled', true);
    }
    else {
      $('#birthdate' + index).attr('disabled', false);
      $('#testdate' + index).attr('disabled', false);
    }
  };

  /*
  Calculate age based on birthdate and testdate.
  */
  dataEntry.calculateAge = function (index) {
    if (dataEntry.shouldCalcAge) {
      var birthDate = $scope.patient.form['birthdate' + index].$viewValue;
      var testDate = $scope.patient.form['testdate' + index].$viewValue;
      if (testDate !== undefined && birthDate !== undefined) {
        var years = patientDataservice.calculateAge(birthDate, testDate);
        $scope.patient.form['age' + index].$setViewValue(years);
        $('#age' + index).val(years);
      }
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
    var files = $rootScope.fileData;
    var r = new FileReader();

    /*
    Read csv file and make daynamic form.
    FIXIT: Parsing should be done by csv parsing package not home made solution.
    */
    r.onload = function (e) {
      var contents = e.target.result;
      var rows = contents.split('\n');
      $scope.patient[0] = { 'id': '', 'age': '', 'birthdate': '', 'testdate': '', 'sex': '', 'education': '', 'test': {} };
      $rootScope.nodeArr = [];
      $rootScope.selectedTest = {};

      angular.forEach(rows, function (fval, fkey) {
        var data = fval.split(';');
        if (data[1] === 'Information') {
          $scope.validfile = true;
        }
      });
      if ($scope.validfile) {
        angular.forEach(rows, function (val, key) {
          var data = val.split(';');
          if (key === 1) {
            var k = 1;
            for (var i = 0; i < data.length; i++) {
              if (data[i] !== '' && i > 2) {
                $scope.patient[k] = { 'id': '', 'age': '', 'birthdate': '', 'testdate': '', 'sex': '', 'education': '', 'test': {} };
                $scope.dataEntry.counter++;
                k++;
              }
            }
          }
          if (key > 4) {
            if (isNaN(parseInt(data[0])) && data[0] !== '') {
              var IdAvailability = testTableService.findTest(data[0], 'id');
              if (IdAvailability && IdAvailability.id !== null && IdAvailability.id !== undefined) {
                $rootScope.selectedTest[data[0]] = IdAvailability;
                if ($rootScope.nodeArr.indexOf(data[0]) < 0) {
                  $rootScope.nodeArr.push(data[0]);
                };
                toastr.success('Data uploaded successfully.')
              }
              else {
                // FIXIT: use toastr instead and improve the message.
                toastr.error('Please upload only those data files that have been downloaded and filled from this website !',
                             'Data upload failed');
              }
            }
          }
        });
        angular.forEach($scope.patient, function (val, key) {
          if (parseInt(key)) {
            $scope.dataEntry.patient[key] = val;
          }
        });
        $timeout(function () {
          angular.forEach(rows, function (val, key) {
            var data = val.split(';');
            if (key > 0) {
              for (var j = 0; j < data.length; j++) {
                var fieldVal = '';
                if (j !== 0 && j !== 1) {
                  if (key > 4) {
                    var IdAvailability = testTableService.findTest(data[0], 'id');
                    if (IdAvailability && IdAvailability.id !== null && IdAvailability.id !== undefined) {
                      var field = data[0];
                      fieldVal = data[j];
                      if ($.inArray(fieldVal, replacearr) >= 0) {
                        fieldVal = '';
                      }
                      else {
                        fieldVal = parseInt(fieldVal);
                      }
                      $scope.patient.form['test' + (j - 2) + '_' + field].$setViewValue(fieldVal);
                      $scope.patient[j - 2].test[field] = fieldVal;
                      $('#test' + (j - 2) + '_' + field.replace(/ /g, '_')).val(fieldVal);
                    }
                  }
                  else {
                    if (data[j] !== '') {
                      $scope.patient.form[data[0] + (j - 2)].$setViewValue(data[j]);
                    }
                    else {
                      delete $scope.patient[(j - 2)][data[0]];
                    }
                    fieldVal = data[j];
                    if (data[0] === 'age') {
                      $('#birthdate' + (j - 2)).attr('disabled', true);
                      $('#testdate' + (j - 2)).attr('disabled', true);
                      fieldVal = parseInt(fieldVal);
                    }
                    if (data[0] === 'sex' || data[0] === 'education') {
                      fieldVal = parseInt(fieldVal);
                    }
                    document.getElementById(data[0] + (j - 2)).value = fieldVal;
                  }
                }
              }
              $('#files').val('');
            }
          });
          // FIXIT: use toastr for communicating status
          //alert($scope.message);
        }, 100);
        $timeout(function () {
          $('#id1').trigger('change');
        }, 1000);
      }
      else {
        $rootScope.fileErr = true;
        $rootScope.txtvalue = '';
        $rootScope.filebutton = true;
        $location.path('/test-selection');
      }
    };
    r.readAsText(files[0]);
  }
}
