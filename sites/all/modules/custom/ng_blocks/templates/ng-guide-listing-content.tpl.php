<div class="guide-listing" ng-controller="guideListController as guideList">
  <div class="guide-teaser" 
       ng-repeat="guide in guideList.guides"
       ng-include src="'/sites/all/themes/ngTheme/ngApp/partials/guide_teaser.html'">
       <!-- See guide_teaser.html partial for guide teasers -->
  </div>
</div>
