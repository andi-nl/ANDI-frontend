'use strict';
app.factory('diagnosisService', ['$window', '$http', '$q', function (win, $http, $q) {
  var diagnosisService = {};
  /*
   return selected Normative date folder test data
  */
  diagnosisService.getTest = function (defaultFolder) {
    return $q(function (resolve, reject) {
      $http.get('data/' + defaultFolder + '/tests.json')
        .success(function (data) {
          var dataObj = {};
          dataObj.data = data;
          dataObj.defaultFolder = defaultFolder;
          resolve(dataObj);
        })
        .error(function (data, status) {
          if (status == 403) {
            reject("wrong token");
          }
        });
    });
  }

  /*
   return selected Normative date List
  */
  diagnosisService.getRelease = function (defaultFolder) {
    return $q(function (resolve, reject) {
      $http.get("data/release.json")
        .success(function (res) {
          resolve({
            "type": "select",
            "value": defaultFolder,
            "values": res
          });
        })
        .error(function (data, status) {
          if (status == 403) {
            reject("wrong token");
          }
        });
    });
  }
  /*
   after form submit make line chart
  */

  return diagnosisService;

}]);


