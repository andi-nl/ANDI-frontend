angular
  module('andiApp')
  .factory('testTableService', testTableService);

testTableService.$inject = ['$http'];

function testTableService($http) {

  var releasePath = "data/release.json"
  var dataPath = "data/"
  var tableFile = "tests.json"
  var releases = [];
  var selectedRelease = '';
  var testTable = {};

  function readReleases(){
    $http.get(releasePath)
      .then(function(response){
        releases = response.data.releases;
        selectedRelease = response.data.defaultRelease;
      }, function(response){
        return(response);
      })
  };

  function readTestTable(){
    $http.get(dataPath + selectedRelease + tableFile)
      .then(function(response){
        testTable = response.data;
      },
      function(response){
        return(response);
      });
  }

};
