<div class="guide-listing" ng-controller="guideListController as guideList">
  <div class="guide-teaser" 
       ng-repeat="guide in guideList.guides"
       ng-include src="'/sites/all/themes/ngTheme/ngApp/partials/guide_teaser.html'">
       <!-- See guide_teaser.html partial for guide teasers -->
  </div>
  <div class="pager">
    <ul>
      <li class="pager-page first" ng-show="guideList.pager.currentPage != 0">
        <a ng-click="guideList.pagerClick(guideList.pager.firstPage)">&laquo; First</a>
      </li>
      <li class="pager-page prev" ng-show="guideList.pager.currentPage != 0">
        <a ng-click="guideList.pagerClick(guideList.pager.prevPage)">&lsaquo; Prev</a>
      </li>
      <li class="pager-page ellipsis" ng-show="guideList.pager.startEllipsis">
        <span>{{guideList.pager.startEllipsis}}</span>
      </li>
      <li class="pager-page" ng-repeat="page in guideList.pager.pages">
        <a ng-click="$parent.guideList.pagerClick(page)" ng-show="page != $parent.guideList.pager.currentPage">{{page + 1}}</a>
        <span ng-show="page == $parent.guideList.pager.currentPage">{{page + 1}}</span>
      </li>
      <li class="pager-page ellipsis" ng-show="guideList.pager.endEllipsis">
        <span>{{guideList.pager.endEllipsis}}</span>
      </li>
      <li class="pager-page next" ng-show="guideList.pager.currentPage != guideList.pager.lastPage">
        <a ng-click="guideList.pagerClick(guideList.pager.nextPage)">&rsaquo; Next</a>
      </li>
      <li class="pager-page last" ng-show="guideList.pager.currentPage != guideList.pager.lastPage">
        <a ng-click="guideList.pagerClick(guideList.pager.lastPage)">&raquo; Last</a>
      </li>
    </ul>
  </div>
</div>
