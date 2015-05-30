<div ng-controller="userInfoController as info" class="user-info">
  <!-- Logged in user -->
  <div ng-show="info.userSignedIn">
    <a href="/user/{{info.userInfo.user_uid}}" title="View profile of {{info.userInfo.user_name}}">
      <img src="{{info.userInfo.user_image_url}}" alt="Profile picture for user {{info.userInfo.user_name}}" class="user-img">
    </a>
    <a href="/user/{{info.userInfo.user_uid}}" title="View profile of {{info.userInfo.user_name}}">{{info.userInfo.user_name}}</a>
    <!-- ng click here with dropdown of some useful menu items [my account, logout, notifications]-->
    <a ng-click="info.menuToggle($event)">
      <span ng-show="!info.menuShow" class="tog-on"></span>
      <span ng-show="info.menuShow" class="tog-off"></span>
    </a>
    <ul class="user-menu" ng-show="info.menuShow">
      <li ng-repeat="link in info.menu" ng-class="info.isLast($last)">
        <a href="{{link.path}}" ng-click="info.stopPropagation($event)">{{link.title}}</a>
      </li>
    </ul>
  </div>
  
  <!-- Logged out user -->
  <div ng-show="!info.userSignedIn">
    <a href="/user/register" class="register" ng-click="info.registerToggle($event)">Register</a>
    <a href="/user/login" class="login" ng-click="info.loginToggle($event)">Login</a>
    <div user-login ng-show="info.showLogin"></div>
    <div user-register ng-show="info.showRegister"></div>
  </div>
</div>