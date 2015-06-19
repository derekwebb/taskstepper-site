var guideListController = angular.module('app')
  .controller('guideListController', [
    '$scope',
    '$rootScope',
    '$q',
    'ViewService',
    'UserService',
    'ImageService',
    'PathService',
    'ToolKit',
  function($scope, $rootScope, $q, ViewService, UserService, ImageService, PathService, ToolKit) {
  
  // Local var stores which rows need more/less links
  var moreIndex = [];
  
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
  
  // Guide title 
  this.guideTitle = Drupal.t("Guide listing");
  
  // Arguments object to be passed into the view
  this.viewParams = {
    page: 0,
    limit: 5, // @TODO: get the limit figure from view info
    args: {},
    offset: 0
  };


  // Handle setting showIndex
  this.bodyClick = function(index, bool) {
    $scope.guideList.showIndex[index] = bool;
  };


  // Term click - standin until pager is finished
  this.termClick = function(event, tid, text) {
    // get any pre-existing user id argument
    var user_arg = ($scope.guideList.viewParams.args.hasOwnProperty('uid')) ? $scope.guideList.viewParams.args.uid : 'all';
    $scope.guideList.termFilter = text; // set filter info
    $scope.guideList.resetView({args: {tid: tid, uid: user_arg}}, true);
    
    // Broadcast change in term
    $rootScope.$broadcast('termChanged', {tid:tid});
    
    event.preventDefault();
  };


  // Handle click of user name (maybe pic too - not sure about if I should implment that)
  this.userClick = function(event, uid, name) {
    // get any pre-existing term id argument
    var term_arg = ($scope.guideList.viewParams.args.hasOwnProperty('tid')) ? $scope.guideList.viewParams.args.tid : 'all';
    $scope.guideList.authorFilter = name; // set filter info
    $scope.guideList.resetView({args: {tid: term_arg, uid: uid}}, true);
    event.preventDefault();
  };

  
  // Listen for changes of author filter from guide_authors_controller
  //  NOTE: must use $scope to access $on here. this.$on results in 
  //  Undefined function error.
  $scope.$on('authorChanged', function(event, data) {
    $scope.guideList.userClick(event, data.uid, data.name);
  });


  // Reset the View for the next page of items
  this.resetView = function(params, reset) {
    // Reset showIndex and users for next pass
    $scope.guideList.showIndex = [];
    $scope.guideList.users = {};
    
    // These params are forever unchanging
    //  and assist in returning view to 
    //  default settings.
    var resetParams = { 
      page: 0,
      limit: 5, // @TODO: get the limit figure from view info
      args: {},
      offset: 0
    };
    
    // Reset params
    if (reset) {
      $scope.guideList.viewParams = resetParams;  
    }
    
    // Add params that were passed in.
    //  Comparing passed in params to
    //  default params.
    for (var p in resetParams) {
      if (params.hasOwnProperty(p)) {
        $scope.guideList.viewParams[p] = params[p];
      }
    }
    
    $scope.guideList.fetchView();
  };


  // Clear filter argument(s) from view
  //  Pass like resetFilters('f1 f2')
  this.resetFilter = function(filters) {
    var f = filters.split(' ');
    for (var i in f) {
      switch (f[i]) {
        case 'tid': // clear term filter
          // Broadcast that term was removed
          $rootScope.$broadcast('termChanged', {}); // pass empty args
          $scope.guideList.termFilter = false;
          break;
        case 'uid': // clear author filter
          $scope.guideList.authorFilter = false; 
          break;
      }
      // Reset arg in viewParams
      $scope.guideList.viewParams.args[f[i]] = 'all';
    }
    // If any args still remain, keep them. But reset all else.
    $scope.guideList.resetView({args: $scope.guideList.viewParams.args}, true);
  };


  // Fetch the view - eg.
  // http://project.loc/guide-service/guide-list?filter_args={"tid":"all","uid":"1"}
  this.fetchView = function() {
    
    var params = $scope.guideList.viewParams;
    
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
      
      // Initialize the pager
      processPager(data);
      
    }).$promise
    
    // Fetch info about users
    .then(function(data) {
      
      // Add user info to scope        
      processUsers(data);

    });
  };
  
  
  // Pager click
  this.pagerClick = function(page) {
    // note, reset is not set so args et.al. remain unchanged
    $scope.guideList.resetView({page: page});
    $scope.guideList.fetchView();
  };
  
  
  // Initialize the controller
  (function init() {
    $scope.guideList.fetchView();
  }());


  // Create the pager for this set of results
  var processPager = function(data) {
    var i = 0; // holds the starting page
    var x = 0; // counts how many pages we have added
    var num_pages = Math.ceil(data.total_rows / data.limit); // Ceiling to get the max number
        
    $scope.guideList.pager       = {}; // Init the pager object
    $scope.guideList.pager.pages = []; // init the scope pages variable

    $scope.guideList.pager.currentPage  = data.current_page;
    $scope.guideList.pager.lastPage     = num_pages - 1;
    $scope.guideList.pager.prevPage     = data.current_page - 1;
    $scope.guideList.pager.nextPage     = data.current_page + 1;
    
    $scope.guideList.pager.displayPages = 4; 
    
    var middle_page     = Math.ceil($scope.guideList.pager.displayPages / 2);
    var first_page      = 0;
    
    // Get the first page in the set
    if (data.current_page >= middle_page) {
      var mod = ($scope.guideList.pager.displayPages % 2) ? 1 : 0; // ensure even numbers dont cause issues
      i = data.current_page - middle_page + mod;
      first_page = i; // remember where our first page in the series is.
    }
    
    // Get the last page
    if ((num_pages - data.current_page) < (middle_page)) {
      i = num_pages - $scope.guideList.pager.displayPages;
      i = (i < 0) ? 0 : i; // correct for short lists.
    }
    
    // Only add pager if we have more than one page
    if (num_pages > 1) {
      do {
        $scope.guideList.pager.pages.push(i);
        i++; // increment the page index (does not necc. start at 0)
        x++; // increment the count index (always starts at 0)
      } while (x < $scope.guideList.pager.displayPages && x < num_pages);
      
      // End ellipsis
      //  i is still set to the last page that was shown
      $scope.guideList.pager.endEllipsis = (i < num_pages) ? '…' : false;
            
      // Start ellipsis
      $scope.guideList.pager.startEllipsis = (first_page > 0 && i > $scope.guideList.pager.displayPages) ? '…' : false;
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


  // Gather user info from results and process it into something
  //  usable on the front end.
  var processUsers = function(data) {
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
      
      // Process users to request images
      processUserImages();
            
    });
  };


  // Process users and get images from image-service
  var processUserImages = function() {

    // Loop through users and get images
    jQuery.each($scope.guideList.users, function(uid) {
      promises.push(ImageService.get({
        style: thumb_preset, 
        uri: getUserImageUri($scope.guideList.users[uid])
      }).$promise);
    });

    // Add updated pictures to the $scope    
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
      promises = []; // reset promises
    });
  };


  // Process created timestamp
  var processCreated = function(data) {
    // Update/process results 
    for (var row in data.results) {
      
      // Update updated timestamp in prep. for application of timeago
      data.results[row].node_changed = new Date(Number(data.results[row].node_changed) * 1000).toISOString();

    }
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

    // only apply Less link if needed
    if (moreIndex[row_index]) {
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
    var link = ' <a class="more" ng-click="guideList.bodyClick($index, true)">Read&nbsp;on</a>';
    
    // Truncate if necc.
    var short_intro = jQuery.truncate(row['Introduction'], {
      length: 250,
      words: true,
      ellipsis: '\u2026' + link
    });

    var more = ''; // storage for more link
    try {
      more = jQuery('.more', short_intro); // select more link
      if (!more.length) { // lets be doubly sure
        // sometimes the ellipsis is added outside of wrapping tags
        more = jQuery(short_intro).filter('.more');
      }
    } catch (err) { 
      // use parseHTML to catch errant cases where outer tags are not used.
      //  Content was simply a string with no outer HTML elements.
      //  This can happen if the string is in full html format.
      short_intro = jQuery.parseHTML(short_intro);
      more = jQuery(short_intro).filter('.more');
    }
    
    // do we have a more link? was it truncated?
    if (more.length) {
      moreIndex[row_index] = true;
    }
    else { // no more link
      moreIndex[row_index] = false;
    }

    // Set up the showIndex
    $scope.guideList.showIndex[row_index] = false;
    return short_intro;
  };
  
  
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


  // Helper to get uri info from user data
  var getUserImageUri = function(user) {
    // do we have a user image?
    if (user.picture && user.picture.hasOwnProperty('uri')) {
      return image_uri = user.picture.uri;
    }
    
    // Use default image (logo)
    else {
      return image_uri = default_img;
    }
  };
}]);
