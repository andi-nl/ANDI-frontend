angular
  .module('andiApp')
  .factory('ocpuService', ocpuService);

ocpuService.$inject = ['$http']

function ocpuService($http) {
  var service = {
    normcomp: normcomp
  };

  var url = '/compute';

  function normcomp(input) {
    var request = {
      method: 'normcomp',
      input: input
    };
    return $http.post(url, request);
  };

  return service;
}
