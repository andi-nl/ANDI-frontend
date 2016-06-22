angular
    .module('andiApp')
    .factory('ocpuService', ocpuService);

ocpuService.$inject = ['$http']

function ocpuService($http) {
  var url = 'http://192.168.99.100'
  var port = '8004'
  var normcompPath = '/ocpu/library/andistats/R'
  var service = {
    normcomp: normcomp,
  };
  return service;

  function normcomp(input){
    var normcompURL = url + ':' + port + normcompPath;
    ocpu.seturl(normcompURL);
    var request = ocpu.call("normcomp", {"myJSON": JSON.stringify(input)}, function(session){
      session.getObject(function(data){
        console.log("ocpu says: " + data)
      })
    })
  };
}
