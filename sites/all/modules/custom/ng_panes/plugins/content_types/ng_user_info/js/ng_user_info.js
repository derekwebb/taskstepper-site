(function (angular) {
  'use strict';
  
  var appPath = '/sites/all/modules/custom/ng_panes/plugins/content_types/ng_user_info';
  var userInfoApp = angular.module('UserInfoPane', ['ngResource']);
  
  // Controller
  userInfoApp.controller('UserInfoController', ['$scope', 'MenuService', 'LoginService', function($scope, MenuService, LoginService) {
    
    // Initialize the controller
    this.init = function() {
      this.userInfo     = Drupal.settings.ng_panes.ng_user_info; // Get the user login state
      this.menuShow     = false;
      this.showLogin    = false;
      this.showRegister = false;
      
      if (this.userInfo.user_uid != '0') {
        this.userSignedIn = true;
        this.userSignedOut = false;
        return 'logged in';
      }
      else {
        this.userSignedIn = false;
        this.userSignedOut = true;
        return 'logged out';
      }
    };
    
    // Toggle the menu open or closed
    this.menuToggle = function(event) {
      this.menuShow = !this.menuShow;
      event.stopPropagation(); // Prevent from triggering window.onclick
    };
    // Toggle login
    this.loginToggle    = function(event) {
      this.showLogin    = !this.showLogin;
      this.showRegister = false;
      event.stopPropagation(); // Prevent from triggering window.onclick
      event.preventDefault();
    };
    // Toggle register
    this.registerToggle = function(event) {
      this.showRegister = !this.showRegister;
      this.showLogin    = false;
      event.stopPropagation(); // Prevent from triggering window.onclick
      event.preventDefault();
    };
    // Allow the items to close if user clicks elsewhere
    window.onclick = function(e) {
      if ($scope.info.menuShow || $scope.info.showRegister || $scope.info.showLogin) {
        $scope.info.menuShow     = false;
        $scope.info.showRegister = false;
        $scope.info.showLogin    = false;
        $scope.$apply();
      }
    };
    
    // Prevent menu from closing when clicking on a contained
    //  link. Less confusion that something is happening this way.
    this.stopPropagation = function(event) {
      event.stopPropagation();
    };
    
    // Build links from the service call
    this.buildLinks = function(links) {
      var l = links.tree;
      var set = [];
      for (var key in l) {
        if (l.hasOwnProperty(key)) {
          set.push({
            path: '/'+l[key].link.path,
            title: l[key].link.title,
            weight: Number(l[key].link.weight)
          });
        }
      }
      set = _.sortBy(set, 'weight');
      this.menu = set; // send to the menu
    };
    
    this.state = this.init();
    if (this.state == 'logged in') {
      var m = MenuService.get({menu:'user-menu'}, function(m) {
        // I dont like it but it requires that I ref. the $scope by the name given on the view side "info" ugh
        $scope.info.buildLinks(m);
      });
    }
    
    // Apply last class to menu links
    this.isLast = function(check) {
      var cssClass = check ? 'last' : null;
      return cssClass;
    };
    
    // Call the login factory service
    this.login = function() {
      var data = {
        username: this.username,
        password: this.password
      };
      var login = LoginService.save({}, data, 
        function(data) {
          // possibly do stuff with result...
          document.location.reload(true);
        },
        function(reply) {
          $scope.info.errorMessage = reply.statusText;
        }  
      );
    };   
  }]);
  
  // Get the links for the logged in user
  userInfoApp.factory('MenuService', function($resource) {
    return $resource("/menu-service/menu/:menu");
  });
  
  // Login factory service
  userInfoApp.factory('LoginService', function($resource) {
    return $resource('/auth-service/user/login');
  });
  
  // Directives for login and register
  userInfoApp.directive('userLogin', function() {
    return {
      restrict: 'A',
      transclude: false,
      templateUrl: appPath+'/partials/login.html'
    };
  });
  userInfoApp.directive('userRegister', function() {
    return {
      restrict: 'A',
      transclude: false,
      templateUrl: appPath+'/partials/register.html'
    };
  });
  
}(window.angular));
