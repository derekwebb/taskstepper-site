// Login factory service
angular.module('app').factory('LoginService', function($resource) {
  return $resource('/auth-service/user/login');
});