<div ng-app="UserInfoPane" ng-controller="UserInfoController as info">
  <!-- Logged in user -->
  <div ng-show="info.userSignedIn">
    <a href="/user/{{info.userInfo.user_uid}}" title="View profile of {{info.userInfo.user_name}}">
      <img src="{{info.userInfo.user_image_url}}" alt="Profile picture for user {{info.userInfo.user_name}}">
    </a>
    <a href="/user/{{info.userInfo.user_uid}}" title="View profile of {{info.userInfo.user_name}}">{{info.userInfo.user_name}}</a>
    <!-- ng click here with dropdown of some useful menu items [my account, logout, notifications]-->
    <a href="#" ng-click="info.menuToggle()">[+]</a>
    <ul ng-show="info.menuShow"><li ng-repeat="link in info.menu"><a href="{{link.path}}">{{link.title}}</a></li></ul>
  </div>
  
  <!-- Logged out user -->
  <div ng-show="info.userSignedOut">
    <a href="/user/register" class="register">Register</a>
    <a href="/user/login" class="login">Login</a>
  </div>
</div>
