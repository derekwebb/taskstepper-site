// Get links for a menu
angular.module('app').factory('MenuService', function($resource) {
  return $resource("/menu-service/menu/:menu");
});