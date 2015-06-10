// View factory service
angular.module('app').factory('ViewService', function($resource) {
  return $resource('/view-service/views/:view', {}, {
    get: { isArray: true }
  });
});