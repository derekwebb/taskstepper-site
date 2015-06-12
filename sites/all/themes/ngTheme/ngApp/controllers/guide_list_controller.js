var guideListController = angular.module('app')
  .controller('guideListController', [
    '$scope',
    'ViewService',
    'ToolKit',
  function($scope, ViewService, ToolKit) {
  
  // Storage for which rows need more/less links
  this.rowIndex = [];
  
  // Storage for which rows are showing full vs. short intros
  this.showIndex = [];
  

  // Handle setting showIndex
  this.itemClick = function(index, bool) {
    $scope.guideList.showIndex[index] = bool;
  };
  

  // Fetch the guide list view from services
  var data = ViewService.get({view_endpoint:'guide-service', view_path: 'guide-list'}, function(data) {
    //console.log(data);
    
    // Update/process results 
    for (var row in data.results) {
      
      // Create short intro w/ truncate.js
      data.results[row].Intro_short = $scope.guideList.getShortIntro(data.results[row], row);
      
      // Update intro
      data.results[row].Introduction = $scope.guideList.updateIntro(data.results[row], row);
      
    }
    $scope.guideList.guides = data.results;
  });


  // Add a read less anchor tag at the end of the main intro
  this.updateIntro = function(row, row_index) {
    var intro = row['Introduction'].trim();
    var link = ' <a class="less" ng-click="guideList.itemClick($index, false)">Less</a>';
    
    if ($scope.guideList.rowIndex[row_index]) { // only apply Less link if needed
      var index = intro.length - 1;
      var tag = [];
      if (intro.charAt(index) === '>') { // we have a tag at the end
        index--;
        do {
          tag.push(intro.charAt(index));
          index--;
        } while (intro.charAt(index) != '/'); // the closing tag
        index--; // we move the index one more for the "<"
        tag.reverse(); // Reverse
        tag = tag.join('');
      }
  
      var inserts = ['div', 'p']; // we insert the Less link here.
      if (jQuery.inArray(tag, inserts) >= 0) { // insert into the tag
        intro = intro.substr(0, index) + link + intro.substr(index);
      }
      else { // insert at the end of the html
        intro = intro + link;
      }
    }

    return intro; 
  };
  
  
  // Truncate the long intro into a shorter length blurb
  this.getShortIntro = function(row, row_index) {
    var link = ' <a class="more moreish" ng-click="guideList.itemClick($index, true)">Read&nbsp;on</a>';
    
    // Truncate if necc.
    var short_intro = jQuery.truncate(row['Introduction'], {
      length: 250,
      words: true,
      ellipsis: '\u2026' + link
    });

    var more = jQuery('.more', short_intro); // select more link

    if (more.length) { // do we have a more link
      $scope.guideList.rowIndex[row_index] = true;
    }
    else { // no more link
      $scope.guideList.rowIndex[row_index] = false;
    }

    // Set up the showIndex
    $scope.guideList.showIndex[row_index] = false;
    return short_intro;
  };
}]);