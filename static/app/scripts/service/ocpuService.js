angular
  .module('andiApp')
  .factory('ocpuService', ocpuService);

ocpuService.$inject = ['$http']

function ocpuService($http) {
  var service = {
    normcomp: normcomp,
    calccomposite: calccomposite
  };

  var url = '/compute/';

  function ocpu(method, input) {
    var request = {
      method: method,
      input: input
    };
    return $http.post(url, request);
  };

  function normcomp(input) {
    return ocpu('normcomp', input);
  }

  function calccomposite(input) {
    return ocpu('calccomposite', input);
  }

  return service;
}
