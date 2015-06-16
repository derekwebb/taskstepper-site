var guideListController = angular.module('app')
  .controller('guideListController', [
    '$scope',
    '$q',
    'ViewService',
    'UserService',
    'ImageService',
    'PathService',
    'ToolKit',
  function($scope, $q, ViewService, UserService, ImageService, PathService, ToolKit) {
  
  // Local var stores which rows need more/less links
  var rowIndex = [];
  
  // Storage for promise lists
  var promises = [];
  
  // Default user image preset
  var thumb_preset = Drupal.settings.ng_blocks.user_info.user_thumbnail_sml_preset;
  
  // Default image if no user image is set
  var default_img  = Drupal.settings.ng_blocks.user_info.user_default_image;
  
  // Storage for required terms
  var terms = {};

  // Storage for which rows are showing full vs. short intros
  this.showIndex = [];

  // Store user info to be filled in when ready
  this.users = {}; // stored as {uid: data}
  
  // For paging
  this.page = 0;
  this.itemCount = 5;
  this.termArg = '';
    
  // Handle setting showIndex
  this.bodyClick = function(index, bool) {
    $scope.guideList.showIndex[index] = bool;
    console.log($scope.guideList);
  };
  
  // Term click - standin until pager is finished
  this.termClick = function(event, tid) {
    //alert('You clicked '+tid);
    //$scope.guideList.fetchView({tid:tid});
    //$scope.guideList.viewParams.page = $scope.guideList.viewParams.page + 1;
    $scope.guideList.resetView({args:{tid: tid}}, true);
    $scope.guideList.fetchView();
    event.preventDefault();
  };
  
  // Arguments to be passed into the view
  this.viewParams = {
    page: 0,
    limit: 5,
    args: {},
    offset: 0
  };
  
  // Reset the View for the next page of items
  this.resetView = function(params, reset) {
    // Reset showIndex and users for next pass
    $scope.guideList.showIndex = [];
    $scope.guideList.users = {};
    
    // These params are forever unchanging
    //  they act to assist in returning to 
    //  default settings.
    var resetParams = {
      page: 0,
      limit: 5,
      args: {},
      offset: 0
    };
    
    // Reset params
    if (reset) {
      $scope.guideList.viewParams = resetParams;  
    }
    
    // Add params that were passed in
    for (var p in resetParams) {
      if (params.hasOwnProperty(p)) {
        $scope.guideList.viewParams[p] = params[p];
      }
    }
  };
  
  // Fetch the view
  this.fetchView = function() {
    
    params = $scope.guideList.viewParams;
    
    // Get guide-list results
    // With arguments - 
    var data = ViewService.get({
      view_endpoint: 'guide-service', 
      view_path:     'guide-list', 
      filter_args:   params.args, 
      limit:         params.limit, 
      page:          params.page,
      offset:        params.offset
    }, function(data) {
      
      // Process view guide-list body
      processBody(data);
      
      // Process timestamp
      processCreated(data);
      
      // Process terms
      processTerms(data);
         
    }).$promise
    
    // Get user info
    .then(function(data) {
      
      // Compile list of unique users
      jQuery.each(data.results, function(key, row) {
        if (!$scope.guideList.users.hasOwnProperty(row.node_uid)) {
          $scope.guideList.users[row.node_uid] = {};
        }
      });
      
      // Build promise first list
      jQuery.each($scope.guideList.users, function(uid) {
        promises.push(UserService.get({uid: uid}).$promise); // be sure to push the ".$promise" 
      });
  
      // Get all the unique users    
      $q.all(promises).then(function(responses) {
        jQuery.each(responses, function(key, user) {
          // Reset user picture url while we are at it
          $scope.guideList.users[user.uid] = resetUserPictureUrl(user);
          promises = []; // reset promises list
        });
      })
      
      // Get user user image preset info
      .then(function() {
        
        jQuery.each($scope.guideList.users, function(uid) {
          promises.push(ImageService.get({
            style: thumb_preset, 
            uri: getUserImageUri($scope.guideList.users[uid])
          }).$promise);
        });
        
        $q.all(promises).then(function(responses) {
          var i = 0; // good thing responses are all in the order they were put in.
          jQuery.each($scope.guideList.users, function(uid) {
            // User has a pic
            if ($scope.guideList.users[uid].picture && $scope.guideList.users[uid].picture.hasOwnProperty('url')) {
              $scope.guideList.users[uid].picture.url = responses[i].image; 
            }
            // User uses default pic
            else {
              $scope.guideList.users[uid].picture = {
                url: responses[i].image
              };
            } i++;
          });
          promises = [];
        });
        
      });
    });
  };
  
  this.init = function() {
    $scope.guideList.fetchView();
  };
  this.init();
  
  
  // Reset user picture so we dont see a larger image transform to a smaller one.
  var resetUserPictureUrl = function(user) {
    if (!user.picture) {
      user.picture = {}; 
    }
    else {
      user.picture.url = '';
    }
    return user;
  };
  
  var getUserImageUri = function(user) {
    // do we have a user image?
    if (user.picture && user.picture.hasOwnProperty('uri')) {
      return image_uri = user.picture.uri;
    }
    
    // convert to variable get or somesuch
    else {
      return image_uri = default_img;
    }
  };
  
  // http://project.loc/path-service/alias/term?id=1
  var processTerms = function(data) {
    // gather the unique tids for which to gather the path aliases
    var tid = '';
    var paths = {};

    for (var row in data.results) {
      for (var i in data.results[row].TopicTid) {
        tid = data.results[row].TopicTid[i].tid;
        if (!terms.hasOwnProperty[tid]) {
          terms[tid] = {};
        }
      } 
    }
    
    jQuery.each(terms, function(tid) {
      promises.push(PathService.get({
          type: 'term', 
          id: tid
        }).$promise);
    });
    
    $q.all(promises).then(function(responses) {
      // Loop through and set up the terms arrays
      jQuery.each(responses, function(i, response) {
        terms[response.id] = {id: response.id, alias: response.alias};
      });
      for (var row in data.results) {
        for (var i in data.results[row].TopicTid) {
          // Add the path alias to the TopicTid section of the scope for use on the frontend.
          $scope.guideList.guides[row].TopicTid[i]['alias'] = terms[$scope.guideList.guides[row].TopicTid[i].tid].alias;
        }
      }
      promises = [];
    });
  };
  
  // Process created timestamp
  var processCreated = function(data) {
    // Update/process results 
    for (var row in data.results) {
      
      // Update updated timestamp in prep. for application of timeago
      data.results[row].node_changed = new Date(Number(data.results[row].node_changed) * 1000).toISOString();

    }
    //console.log($scope.guideList.guides);
    $scope.guideList.guides = data.results;
  };

  
  // Process the guide-list view fields.
  var processBody = function(data) {
    // Update/process results 
    for (var row in data.results) {
      
      // Create short intro w/ truncate.js
      data.results[row].Intro_short = getShortIntro(data.results[row], row);
      
      // Update intro
      data.results[row].Introduction = updateIntro(data.results[row], row);
      
    }
    $scope.guideList.guides = data.results;
  };

  
  // Add a read less anchor tag at the end of the main intro
  var updateIntro = function(row, row_index) {
    var intro = row['Introduction'].trim();
    var link = ' <a class="less" ng-click="guideList.bodyClick($index, false)">Less</a>';
    
    if (rowIndex[row_index]) { // only apply Less link if needed
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
  var getShortIntro = function(row, row_index) {
    var link = ' <a class="more moreish" ng-click="guideList.bodyClick($index, true)">Read&nbsp;on</a>';
    
    // Truncate if necc.
    var short_intro = jQuery.truncate(row['Introduction'], {
      length: 250,
      words: true,
      ellipsis: '\u2026' + link
    });

    var more = jQuery('.more', short_intro); // select more link

    if (more.length) { // do we have a more link
      rowIndex[row_index] = true;
    }
    else { // no more link
      rowIndex[row_index] = false;
    }

    // Set up the showIndex
    $scope.guideList.showIndex[row_index] = false;
    return short_intro;
  };
}]);
