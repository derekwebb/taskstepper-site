angular.module('ngHtmlCompile', []).
  directive('ngHtmlCompile', function($compile) {
  return {
      restrict: 'A',
      transclude: false,
      link: function(scope, element, attrs) {
      scope.$watch(attrs.ngHtmlCompile, function(newValue, oldValue) {
          element.html(newValue);
          $compile(element.contents())(scope);
      });
    }
  };
});