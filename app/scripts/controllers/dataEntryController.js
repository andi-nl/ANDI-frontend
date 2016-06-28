angular
  .module('andiApp')
  .controller('dataEntryController', dataEntryController);
dataEntryController.$inject = ['$rootScope', '$scope', '$location', '$timeout', '$uibModal', '$q', 'patientDataservice', 'testTableService', '$window', 'ivhTreeviewMgr', 'defaultFolder', 'DATEFORMAT'];
function dataEntryController($rootScope, $scope, $location, $timeout, $uibModal, $q, patientDataservice, testTableService, $window, ivhTreeviewMgr, defaultFolder, DATEFORMAT) {
  $rootScope.tests = ($rootScope.tests !== undefined) ? $rootScope.tests : [];
  $rootScope.txtvalue = ($rootScope.txtvalue !== undefined) ? $rootScope.txtvalue : '';
  this.alertMessage = '';
  this.counter = 1;
  this.ageCalculate = true;
  this.submited = false; // for custom validation flag
  $rootScope.selectedTest = ($rootScope.selectedTest !== undefined) ? $rootScope.selectedTest : {};     // Make selected test object
  /*Patient List*/
  this.patient = [{ 'id': '', 'age': '', 'birthdate': '', 'testdate': '', 'sex': '', 'education': '', 'test': $rootScope.selectedTest }];
  $rootScope.nodeArr = ($rootScope.nodeArr !== undefined) ? $rootScope.nodeArr : [];
  $scope.message = 'Data Uploaded successfully.';
  $scope.format = DATEFORMAT;
	/*
	    Add Patient button event , when user click add patient button
	    that time push new object in patient array
  	*/
  this.addPatient = function () {
    this.patient.push(patientDataservice.addPatient($rootScope.selectedTest));
    this.counter++;
  };
	/*
	   remove patient inside form and also check atleast one patient data
	    needed to process further
	*/
  this.removeColumn = function (index, event) {
    // remove the column specified in index
    // you must cycle all the rows and remove the item
    // row by row
    if (this.patient.length > 1) {
      this.patient.splice(index, 1);
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
      this.counter--;
      event.preventDefault();
    }
    else {
      alert('Data for atleast one patient needs to be filled in !');
      event.preventDefault();
    }
  };
	/*
		patient form age enter time disable particular column
		birthdate and testdate field
	*/
  this.disableDate = function (index) {
    if ($scope.patient.form['age' + index].$viewValue !== '') {
      $('#birthdate' + index).attr('disabled', true);
      $('#testdate' + index).attr('disabled', true);
    }
    else {
      $('#birthdate' + index).attr('disabled', false);
      $('#testdate' + index).attr('disabled', false);
    }
  };
	/*
		age field calculation on birthdate and testdate filed
	*/
  this.calculateAge = function (index) {
    if (this.ageCalculate) {
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
	 form id field unique validation check
	*/
  this.verifyId = function () {
    var sorted = [];
    for (var i in $scope.patient) {
      if ($scope.patient[i].id !== null && $scope.patient[i].id !== '' && $scope.patient[i].id !== undefined) {
        if (sorted.indexOf($scope.patient[i].id) >= 0) {
          $scope.patient.form['id' + i].$setValidity('duplicate', !true);
          //$scope.patient.form['id0'].$setValidity('duplicate',!true);
        }
        else {
          sorted.push($scope.patient[i].id);
          $scope.patient.form['id' + i].$setValidity('duplicate', !false);
        }
      }
    }
  };
	/*
	 Submit form event to create patient object and move to next tab
	*/
  this.submit = function (isValid) {
    // check to make sure the form is completely valid
    if ($scope.patient.form.$invalid) {
      $scope.dataEntry.submited = true;
    }
    else {
      $scope.dataEntry.submited = true;
      $rootScope.submitData = patientDataservice.submitPatient($scope);
      console.log($rootScope.submitData);
      $location.path('/results');
    }
  };
  if ($rootScope.fileData !== undefined) {
    var replacearr = $rootScope.txtvalue.split(";");
    var files = $rootScope.fileData;
    var r = new FileReader();
		/*
		read csv file and make daynamic form
		*/
    r.onload = function (e) {
      var contents = e.target.result;
      var rows = contents.split('\n');
      $scope.patient[0] = { 'id': '', 'age': '', 'birthdate': '', 'testdate': '', 'sex': '', 'education': '', 'test': {} };
      $rootScope.nodeArr = [];
      $rootScope.selectedTest = {};
      angular.forEach(rows, function (val, key) {
        var data = val.split(';');
        if (key === 1) {
          var k = 1;
          for (var i = 0; i < data.length; i++) {
            if (data[i] !== '' && i > 1) {
              $scope.patient[k] = { 'id': '', 'age': '', 'birthdate': '', 'testdate': '', 'sex': '', 'education': '', 'test': {} };
              $scope.dataEntry.counter++;
              k++;
            }
          }
        }
        if (key > 4) {
          if (data[0] !== '' && $rootScope.nodeArr.indexOf(data[0]) < 0) {
            $rootScope.nodeArr.push(data[0]);
          };
          if (isNaN(parseInt(data[0])) && data[0] !== '') {
            var IdAvailability = testTableService.findTest(data[0], 'id');
            if (IdAvailability && IdAvailability.id !== null && IdAvailability.id !== undefined) {
              $rootScope.selectedTest[data[0]] = IdAvailability;
            }
            else {
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
              if (data[j] !== '' && j !== 0) {
                if (key > 4) {
                  var IdAvailability = testTableService.findTest(data[0], 'id');
                  if (IdAvailability && IdAvailability.id !== null && IdAvailability.id !== undefined) {
                    var field = data[0];//data[0].replace(/ /g,"_");//'#test'+j+'_'+data[0].replace(/ /g,"");
                    fieldVal = data[j];//parseInt(data[j]);
                    if ($.inArray(fieldVal, replacearr) >= 0) {
                      fieldVal = '';
                    }
                    else {
                      fieldVal = parseInt(fieldVal);
                    }
                    $scope.patient.form['test' + (j - 1) + '_' + field].$setViewValue(fieldVal);
                    $scope.patient[j - 1].test[field] = fieldVal;
                    $('#test' + (j - 1) + '_' + field.replace(/ /g, "_")).val(fieldVal);
                  }
                }
                else {
                  $scope.patient.form[data[0] + (j - 1)].$setViewValue(data[j]);
                  fieldVal = data[j];
                  if (data[0] === 'age') {
                    $('#birthdate' + (j - 1)).attr('disabled', true);
                    $('#testdate' + (j - 1)).attr('disabled', true);
                    fieldVal = parseInt(fieldVal);
                  }
                  if (data[0] === 'sex' || data[0] === 'education') {
                    fieldVal = parseInt(fieldVal);
                  }
                  document.getElementById(data[0] + (j - 1)).value = fieldVal;
                }
              }
            }
            $("#files").val('');
          }
        });
        alert($scope.message);
      }, 100);
      $timeout(function () {
        $('#id1').trigger('change');
      }, 1000);
    };
    r.readAsText(files[0]);
  }
}
