var guideListController = angular.module('app')
  .controller('guideListController', [
    '$scope',
    'ViewService',
    'ToolKit',
  function($scope, ViewService, ToolKit) {
  
  var v = ViewService.get({view:'guides', tid:1}, function(v) {
    // Ref. the $scope by the name given on the view side "info" ugh
    console.log(v);
    $scope.guideList.guides = v;
  });

}]);