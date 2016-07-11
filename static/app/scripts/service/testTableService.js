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
  };

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
  };

  return {
    getTest: getTest,
    getRelease: getRelease,
    expandCollapseTree: expandCollapseTree,
    findTest: findTest
  };
};
