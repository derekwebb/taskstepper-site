var userInfoController = angular.module('app')
  .controller('userInfoController', [
    '$scope', 
    'ToolKit',
    'MenuService', 
    'LoginService', 
    'RegisterService',
  function($scope, ToolKit, MenuService, LoginService, RegisterService) {
  
  // Initialize the controller
  this.init = function() {
    this.userInfo     = Drupal.settings.ng_blocks.user_info; // Get the user info
    this.menuShow     = false;
    this.showLogin    = false;
    this.showRegister = false;
    
    if (this.userInfo.user_uid != '0') {
      this.userSignedIn = true;
    }
    else {
      this.userSignedIn = false;
    }
  };
  
  // Fire the init function
  this.init();
  
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
    this.menu = ToolKit.buildLinks(links); // send to the menu
  };
  
  this.state = this.init();
  if (this.userSignedIn) {
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
      username: this.loginUsername,
      password: this.loginPassword
    };
    var login = LoginService.save({}, data, 
      function(data) {
        // possibly do stuff with result...
        document.location.reload(true);
      },
      function(reply) {
        $scope.info.loginError = true;
        $scope.info.loginErrorMessage = reply.statusText;
      }  
    );
  };
  
  // Call the login factory service
  this.register = function() {
    var data = {
      name: this.regUsername,
      mail: this.regEmail,
      pass: this.regPassword
    };
    var register = RegisterService.save({}, data, 
      function(data) {
        // possibly do stuff with result...
        document.location.reload(true);
      },
      function(reply) {
        // Reset errors in prep for this round.
        $scope.info.registerNameError = false;
        $scope.info.registerEmailError = false;

        var errors = reply.data.form_errors;
        for (var error in errors) {
          if (error === 'name') {
            $scope.info.registerNameError = true;
          }
          if (error === 'mail') {
            $scope.info.registerEmailError = true;
          }
          // Email validation should go here...
          // See also password policy.
        }
        $scope.info.registerError = true;
        $scope.info.regErrorMessage = reply.statusText;
      }  
    );
  };

}]);