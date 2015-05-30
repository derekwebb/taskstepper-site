<div class="primary-links">
  <ul>
    <li ng-repeat="link in header.primaryMenu" ng-class="header.isLast($last)">
      <a href="{{link.path}}">{{link.title}}</a>
      <span class="divider" ng-show="!$last"> / </span>
    </li>
  </ul>
</div>