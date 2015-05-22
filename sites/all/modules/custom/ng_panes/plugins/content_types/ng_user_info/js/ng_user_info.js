(function (angular) {
  'use strict';
  var userInfoApp = angular.module('UserInfoPane', ['ngResource']);
  
  userInfoApp.controller('UserInfoController', ['$scope', 'MenuService', function($scope, MenuService) {
    
    // Initialize the controller
    this.init = function() {
      this.userInfo = Drupal.settings.ng_panes.ng_user_info; // Get the user login state
      this.menuShow = false;
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
    
    this.menuToggle = function() {
      console.log('Toggling');
      this.menuShow = !this.menuShow;
    };
    
    // Build links from the service call
    this.buildLinks = function(links) {
      //console.log(links.tree);
      var l = links.tree;
      var set = {};
      for (var key in l) {
        if (l.hasOwnProperty(key)) {
          set[key] = {};
          //set[key]['path'] = '';
          //set[key]['title'] = '';
          set[key]['path'] = l[key].link.path;
          set[key]['title'] = l[key].link.title;
        }
      }
      this.menu = set; // send to the menu
    };
    
    this.state = this.init();
    if (this.state == 'logged in') {
      var m = MenuService.get({menu:'main-menu'}, function(m) {
        // I dont like it but it requires that I ref. the $scope by the name given on the view side "info" ugh
        $scope.info.buildLinks(m);
      });
    }
    
  }]);
  
  // Get the links for the logged in user
  userInfoApp.factory('MenuService', function($resource) {
    return $resource("/menu-service/menu/:menu");
  });
}(window.angular));
