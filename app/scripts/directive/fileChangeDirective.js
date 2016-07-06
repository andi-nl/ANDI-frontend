'use strict';
/* During file tag selection time bind change event
  and call this event when user selects file */
app.directive('customOnChange', function () {
  return {
    restrict: 'A', // attribute
    link: function (scope, element, attrs) {
      var onChangeFunc = scope.$eval(attrs.customOnChange); // event name
      element.bind('change', onChangeFunc); // bind event
    }
  };
});
