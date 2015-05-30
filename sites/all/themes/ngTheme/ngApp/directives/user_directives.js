// Directives for login and register (et.al. - in time)

// User login
angular.module('app').directive('userLogin', ['ToolKit', function(ToolKit) {
  return {
    restrict: 'A',
    transclude: false,
    templateUrl: ToolKit.appPath()+'/partials/login.html'
  };
}]);

// User registration
angular.module('app').directive('userRegister', ['ToolKit', function(ToolKit) {
  return {
    restrict: 'A',
    transclude: false,
    templateUrl: ToolKit.appPath()+'/partials/register.html'
  };
}]);
