angular
    .module('andiApp')
    .factory('opencpu', opencpu);

opencpu.$inject = ['$http']

function opencpu($http) {
  var url = 'http://192.168.99.100'
  var port = '8004'
  var normcompPath = '/ocpu/library/andistats/R/normcomp/json'
  var service = {
    normcomp: normcomp,
  };
  return service;

  function normcomp(input){
    var normcompURL = url + ':' + port + normcompPath;
    return $http.post(normcompURL, input).then(function(result){
      return result.data;
    });
  };
}
