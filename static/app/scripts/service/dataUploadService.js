'use strict';

angular
  .module('andiApp')
  .factory('dataUploadService', dataUploadService);

dataUploadService.$inject = ['$rootScope', '$location', 'toastr', 'patientDataservice', 'testTableService'];

function dataUploadService($rootScope, $location, toastr, patientDataservice, testTableService) {

  var patients;

  function upload(data, missing){
    var missingValues = [];
    missing.forEach(function(val){
      console.log(val, parseInt(val));
      missingValues.push(parseInt(val));
    });

    console.log('upload');
    console.log(data);
    var files = data;
    var r = new FileReader();
    r.onloadend = function (e) {
      try{
        $rootScope.selectedTest = {};
        var data = Papa.parse(e.target.result, {delimiter: '\t', dynamicTyping: true});
        console.log(data);

        patients = [];

        // add data from csv to patients array
        if(data.data.length > 2){
          data.data.splice(1).forEach(function(row){
            var fieldName = row[0];
            var test = testTableService.findTest(fieldName, 'id');
            if(test !== {}){
              $rootScope.selectedTest[fieldName] = test;
            }
            row.splice(2).forEach(function(value, index){
              var val;
              var p;

              // add new, empty patient if required
              if(patients.length <= index){
                patients.push(patientDataservice.addPatient([]));
              }

              if(patients[index].id === ''){
                p = '#'+(index+1);
              } else {
                p = patients[index].id;
              }

              switch(fieldName) {
                case 'sex':
                  // sex must be 0 or 1
                  if(value !== 0 && value !== 1){
                    toastr.warning('Patient '+p+': Invalid value for "sex". Using empty value instead.');
                    val = '';
                  } else {
                    // The form needs a string
                    val = ''+value;
                  }
                  break;
                case 'education':
                  // education must be between 1 and 7
                  if(value < 0 || value > 7){
                    toastr.warning('Patient '+p+': Invalid value for "education". Using empty value instead.');
                    val = '';
                  } else {
                    // The form needs a string
                    val = ''+value;
                  }
                  break;
                default:
                  // remove missing values
                  if(_.includes(missingValues, value)){
                    val = '';
                  } else {
                    val = value;
                  }
              }

              patients[index][fieldName] = val;
            });
          });
        }

        if(patients.length == 0){
          dataUploadFailed('No patient data found in file. Please enter data for at least one patient using the template downloaded from this page.');
        } else {
          toastr.success('Data uploaded successfully.');
        }

        $rootScope.$broadcast('csvUploaded', patients);
        testTableService.setSelectedTestsWithComputedVarArguments();
      } catch(err){
        console.log(err);
        // invalid file
        dataUploadFailed('Invalid file format. Please download the correct template to upload data.');
      }

    };
    r.readAsText(files[0]);
  }

  function dataUploadFailed(msg){
    $rootScope.fileErr = msg;
    $location.path('/test-selection');
  }

  // check intermediary and computed values
  $rootScope.$on('selectedTestsWithComputedVarArguments', function(event, tests){
    patients.forEach(function(patient){
      _.forOwn(tests, function(test, testName){
        patientDataservice.disableIntermediaryAndComputedVariables(testName, patient);
      });
    });
  });

  return {
    upload: upload
  };
}
