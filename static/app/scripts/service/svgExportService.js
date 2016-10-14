angular
  .module('andiApp')
  .factory('svgExportService', svgExportService);

svgExportService.$inject = ['$http']

function svgExportService($http) {
  var service = {
    svg2pdf: svg2pdf,
    getCSS: getCSS
  };

  var url = '/svg2pdf/';

  function svg2pdf(svgClassName) {
    var svg = document.getElementsByClassName(svgClassName)[0].cloneNode(true);

    // a lot of style information is in de CSS, so, add the css to the svg
    return getCSS().then(function success(response){
      var css = response.data.replace(/\n/g, '');
      svg.insertAdjacentHTML('afterbegin', '<style type="text/css" media="screen"><![CDATA['+ css +']]></style>');
      console.log(svg);
      console.log(svg.getAttribute('width'));
      var width = parseInt(svg.getAttribute('width').match(/\d+/)[0]);
      svg.setAttribute('width', (width+50)+"px");
      console.log(svg);
      var xml = (new XMLSerializer()).serializeToString(svg);
      var request = {
        svg: xml
      };
      return $http.post(url, request, {responseType: 'arraybuffer'});

    }, function error(response){
      console.log('error');
      console.log(response);
    });
  }

  function getCSS(){
    return $http.get('/static/app/styles/style.css');
  }

  return service;
}
