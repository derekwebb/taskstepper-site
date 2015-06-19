<div class="guide-listing" ng-controller="guideListController as guideList">
  <h1 class="mb-0625">{{guideList.guideTitle}}</h1>
  <div class="clearfix">
    <div class="guide-list-filters hlite rounded-20 mb-125 left" ng-show="guideList.termFilter || guideList.authorFilter">
      <span class="filter-intro">Filtered by</span>
      <span class="term-filter pointer" title="Reset topic filter" ng-show="guideList.termFilter" ng-click="guideList.resetFilter('tid')"><i>topic:</i> "<strong>{{guideList.termFilter}}</strong>" <span class="mdred pointer strong">&#215;</span></span>
      <span class="filter-join" ng-show="guideList.termFilter && guideList.authorFilter"> and</span>
      <span class="author-filter pointer" title="Reset author filter" ng-show="guideList.authorFilter" ng-click="guideList.resetFilter('uid')"><i>author:</i> "<strong>{{guideList.authorFilter}}</strong>" <span class="mdred pointer strong">&#215;</span></span>
    </div>
    <span class="reset reset-all pointer ml-3125 p-0625 block left" ng-click="guideList.resetFilter('uid tid')" ng-show="guideList.termFilter || guideList.authorFilter">Reset all <span class="mdred strong">&#215;</span></span>
  </div>
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
        <a ng-click="guideList.pagerClick(guideList.pager.nextPage)">Next &rsaquo;</a>
      </li>
      <li class="pager-page last" ng-show="guideList.pager.currentPage != guideList.pager.lastPage">
        <a ng-click="guideList.pagerClick(guideList.pager.lastPage)">Last &raquo;</a>
      </li>
      <li class="pager-page reset pointer" ng-click="guideList.resetFilter('uid tid')" ng-show="guideList.termFilter || guideList.authorFilter">
        Reset filters <span class="mdred strong">&#215;</span>
      </li>
    </ul>
  </div>
</div>
