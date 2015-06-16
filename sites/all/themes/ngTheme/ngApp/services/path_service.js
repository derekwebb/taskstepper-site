// Get path alias from services
angular.module('app').factory('PathService', function($resource) {
  return $resource("/path-service/alias/:type");
});