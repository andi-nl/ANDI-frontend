angular
  .module('andiApp')
  .factory('ocpuService', ocpuService);

ocpuService.$inject = ['$http', '$q']

function ocpuService($http, $q) {
  var ip = 'http://192.168.99.100';
  var port = '8004';
  var route = '/ocpu/library/andistats/R';
  var ocpuPath = ip + ':' + port + route;
  var service = {
    normcomp: normcomp
  };

  function normcomp(input) {
    var defer = $q.defer();
    ocpu.seturl(ocpuPath);
    ocpu.call('normcomp', { 'myJSON': JSON.stringify(input) },
      function (session) {
        session.getObject(function (data) {
          defer.resolve(data);
        });
      });
    return defer.promise;
  };

  return service;
}
