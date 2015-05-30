// Register factory service
angular.module('app').factory('RegisterService', function($resource) {
  return $resource('/auth-service/user/register');
});