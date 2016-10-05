angular
  .module('andiApp')
  .factory('svgExportService', svgExportService);

svgExportService.$inject = ['$http']

function svgExportService($http) {
  var service = {
    svg2pdf: svg2pdf
  };

  var url = '/svg2pdf/';

  function svg2pdf(svg) {
    var request = {
      svg: svg
    };
    return $http.post(url, request);
  }

  return service;
}
