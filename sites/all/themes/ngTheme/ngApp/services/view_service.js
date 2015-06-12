// View factory service

// This service is now to be used with individual view endpoints
//  Only the individual endpoints report info about row counts
//  and accept args.

// view_endpoint is configured in the services admin
// view_path is the path to the service view (view admin)
angular.module('app').factory('ViewService', function($resource) {
  return $resource('/:view_endpoint/:view_path', {}, {});
});