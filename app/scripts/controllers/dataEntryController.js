angular
  .module('andiApp')
  .controller('dataEntryController', dataEntryController);

dataEntryController.$inject = [
  '$rootScope', '$scope', '$location', '$timeout', '$uibModal', '$q',
  'patientDataservice', 'testTableService', '$window', 'ivhTreeviewMgr',
  'DATEFORMAT'
];

function dataEntryController($rootScope, $scope, $location, $timeout,
  $uibModal, $q, patientDataservice, testTableService,
  $window, ivhTreeviewMgr, DATEFORMAT) {
  var vm = this;

  $rootScope.tests = ($rootScope.tests !== undefined) ? $rootScope.tests : [];
  $rootScope.txtvalue = ($rootScope.txtvalue !== undefined) ? $rootScope.txtvalue : '';

  vm.alertMessage = '';
  vm.counter = 1;
  vm.shouldCalcAge = true;
  vm.submited = false; // for custom validation flag

  // Make selected test object
  $rootScope.selectedTest = ($rootScope.selectedTest !== undefined) ? $rootScope.selectedTest : {};

  // Patient List
  vm.patient = [{ 'id': '', 'age': '', 'birthdate': '', 'testdate': '', 'sex': '', 'education': '', 'test': $rootScope.selectedTest }];

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
  vm.go = function (path) {
    $location.path(path);
  };

  vm.addPatient = function () {
    vm.patient.push(patientDataservice.addPatient($rootScope.selectedTest));
    vm.counter++;
  };

  /*
     Remove patient from the table.
     Check that at least one patient is present.
  */
  vm.removeColumn = function (index, event) {
    // remove the column specified in index
    // you must cycle all the rows and remove the item
    // row by row
    if (vm.patient.length > 1) {
      vm.patient.splice(index, 1);
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
      vm.counter--;
      event.preventDefault();
    }
    else {
      alert('Data for atleast one patient needs to be filled in !');
      event.preventDefault();
    }
  };

  vm.dateRequired = function (index) {
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
  vm.disableDate = function (index) {
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
  vm.calculateAge = function (index) {
    if (vm.shouldCalcAge) {
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
  vm.verifyId = function () {
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
  Submit form and move to results page.
  */
  vm.submit = function (isValid) {
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
              }
              else {
                // FIXIT: use toastr instead and improve the message.
                $scope.message = 'WARNING: Please upload only those data files that have been downloaded and filled from this website !';
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
          alert($scope.message);
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
