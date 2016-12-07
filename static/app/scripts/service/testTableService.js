'use strict';
angular
  .module('andiApp')
  .factory('testTableService', testTableService);

testTableService.$inject = ['$http', 'ivhTreeviewMgr', '$rootScope'];

function testTableService($http, ivhTreeviewMgr, $rootScope) {
  var releasePath = 'static/app/data/release.json';
  var dataPath = 'static/app/data/';
  var tableFile = '/tests.json';
  var testData = [];
  var testid = {};
  var keepgoing = true;

  function getRelease(callback) {
    $http.get(releasePath)
      .then(function (response) {
        callback({
          'type': 'select',
          'value': response.data.default,
          'values': response.data.datasets
        });
      }, function (response) {
        return (response);
      });
  }

  function getTest(defaultFolder, callback) {
    $http.get(dataPath + defaultFolder + tableFile)
      .then(function (response) {
        testData = response.data;
        var dataObj = {};
        dataObj.data = response.data;
        dataObj.defaultFolder = defaultFolder;
        callback(dataObj);
      },
      function (response) {
        return (response);
      });
  }

  function expandCollapseTree(testSearch) {
    if (testSearch === '') {
      ivhTreeviewMgr.collapseRecursive(testData, testData);
    }
    if (testSearch !== '' && testSearch.length > 0) {
      ivhTreeviewMgr.expandRecursive(testData, testData);
    }
  }

  /*
  based on findField find particular test and return test object
  */
  function findTest(value, findField) {
    testid = {};
    childTest($rootScope.tests, value, findField); // check on child test
    keepgoing = true;
    return testid;
  }

  function childTest(treedata, value, findField) {
    angular.forEach(treedata, function (childVal, childKey) {
      if (keepgoing) {
        if (childVal.children !== undefined && childVal.children.length > 0) {
          childTest(childVal.children, value, findField);
        }
        else {
          if (childVal[findField] === value) {
            testid = childVal;
            keepgoing = false;
          }
        }
      }
    });
  }

  function getTestsDataFromCsv(){
    return $http.get(dataPath + 'test_variable_info.csv');
  }

  function setSelectedTestsWithComputedVarArguments(){
    getTestsDataFromCsv().then(function success(response){
      var csvConfig = {
        header: true,
        dynamicTyping: true,
      };
      var data = Papa.parse(response.data, csvConfig);
      var tests = data.data;

      var selectedTestsWithComputedVarArguments = {};
      var computedVarArgs;
      angular.forEach($rootScope.selectedTest, function(test){
        if(test.computed_variable_arguments === undefined){
          computedVarArgs = [];
        } else {
          computedVarArgs = test.computed_variable_arguments.split(',');
        }
        if(computedVarArgs.length > 0 && computedVarArgs[0] !== ""){
          computedVarArgs.forEach(function(arg){
            var add = _.find(tests, function(t) { return t.ID === arg; });
            add.intermediary = true;
            add.intermediaryValueFor = test.id;
            add.disabled = false;
            add.class = 'intermediary';
            selectedTestsWithComputedVarArguments[arg] = add;
          });
          test.class = 'computed';
        }
        test.disabled = false;
        selectedTestsWithComputedVarArguments[test.id] = test;
      });
      // Broadcast alone was not sufficient, because for some reason the broadcast
      // was not received when the user came back to the test selection page by
      // clicking the 'previous' button. However, the broadcast is required to
      // set the correct data for the data upload csv file.
      $rootScope.selectedTestsWithComputedVarArguments = selectedTestsWithComputedVarArguments;
      $rootScope.$broadcast('selectedTestsWithComputedVarArguments', selectedTestsWithComputedVarArguments);
    }, function error(response){
      console.log('error');
      console.log(response);
    });
  }

  return {
    getTest: getTest,
    getRelease: getRelease,
    expandCollapseTree: expandCollapseTree,
    findTest: findTest,
    getTestsDataFromCsv: getTestsDataFromCsv,
    setSelectedTestsWithComputedVarArguments: setSelectedTestsWithComputedVarArguments
  };
}
