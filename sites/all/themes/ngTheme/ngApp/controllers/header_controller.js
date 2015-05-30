var headerController = angular.module('app')
  .controller('headerController', [
    '$scope', 
    'ToolKit', 
    'MenuService', 
  function($scope, ToolKit, MenuService) {
  
  // Get the main menu using menu service
  var m = MenuService.get({menu:'main-menu'}, function(m) {
    // I dont like it but it requires that I ref. the $scope by the name given on the view side "info" ugh
    $scope.header.buildLinks(m);
  });
  
  // Apply last class to menu links
  this.isLast = function(check) { 
    return ToolKit.isLast(check);
  };
  
  // Build links from the service call
  this.buildLinks = function(links) {
    this.primaryMenu = ToolKit.buildLinks(links);
  };
  
}]);
