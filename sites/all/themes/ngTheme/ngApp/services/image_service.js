// Get image preset from services
angular.module('app').factory('ImageService', function($resource) {
  return $resource("/image-service/image/:style");
});