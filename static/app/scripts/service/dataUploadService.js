'use strict';

angular
  .module('andiApp')
  .factory('dataUploadService', dataUploadService);

dataUploadService.$inject = ['$rootScope', 'patientDataservice']

function dataUploadService($rootScope, patientDataservice) {

  function upload(data, missingValues){
    var selectedTests = {};
    var patients = [];

    console.log('upload');
    console.log(data);
    var files = data;
    var r = new FileReader();
    r.onloadend = function (e) {
      var data = Papa.parse(e.target.result, {delimiter: '\t', dynamicTyping: true});
      console.log(data);

      // make array with empty patients
      for(var i=0; i<(data.data[0].length-2); i++){
        patients.push({});
      }

      // add data from csv to patients array
      if(data.data.length > 2){
        data.data.splice(1).forEach(function(row){
          // TODO: do data checking and removal of missing values
          var fieldName = row[0];
          row.splice(2).forEach(function(value, index){
            patients[index][fieldName] = value;
          });
        });
      }
      $rootScope.$broadcast('csvUploaded', patients);
    };
    r.readAsText(files[0]);
    return patients;
  }

  return {
    upload: upload
  };
}
