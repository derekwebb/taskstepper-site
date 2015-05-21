(function (angular) {
  'use strict';
  var userInfoApp = angular.module('UserInfoPane', []);
  
  userInfoApp.controller('UserInfoController', ['$scope', function($scope) {
    this.init = function() {
      this.userInfo = Drupal.settings.ng_panes.ng_user_info; // Get the user login state
      
      if (this.userInfo.user_uid != '0') {
        this.userSignedIn = true;
        this.userSignedOut = false;
      }
      else {
        this.userSignedIn = false;
        this.userSignedOut = true;
      }
    };
    
    this.state = this.init();
  }]);
}(window.angular));
