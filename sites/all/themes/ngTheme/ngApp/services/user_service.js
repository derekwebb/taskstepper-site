// User factory service
angular.module('app').factory('UserService', function($resource) {
  return $resource('/user-service/user/:uid', {}, {});
});