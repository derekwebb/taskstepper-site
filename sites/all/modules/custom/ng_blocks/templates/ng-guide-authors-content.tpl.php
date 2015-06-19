<div class="guide-authors" ng-controller="guideAuthorsController as guideAuthors">
  <h2>Guide authors</h2>  
  <ul class="author-list">
    <li ng-repeat="author in guideAuthors.authors">
      <a ng-click="$parent.guideAuthors.authorClick($event, author.node_users_uid, author.users_name)">{{author.users_name}} ({{author.node_users_type}})</a>
    </li>
  </ul>
  <a ng-click="guideAuthors.moreAuthors()" ng-show="guideAuthors.currentPage != guideAuthors.lastPage">More</a>
</div>
