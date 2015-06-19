var guideAuthorController = angular.module('app')
  .controller('guideAuthorsController', [
    '$scope',
    '$rootScope',
    'ViewService',
  function($scope, $rootScope, ViewService) {

    // Arguments object to be passed into the view
    this.viewParams = {
      page: 0,
      limit: 5, // @TODO: get the limit figure from view info
      args: {},
      offset: 0
    };

    this.currentPage = 0;
    this.lastPage    = 0;

    // Listen for changes of author filter from guide_authors_controller
    //  NOTE: must use $scope to access $on here. this.$on results in 
    //  Undefined function error.
    $scope.$on('termChanged', function(event, data) {
      $scope.guideAuthors.viewParams.args = data;
      $scope.guideAuthors.viewParams.page = 0;
      $scope.guideAuthors.fetchAuthors('reset pager');
    });


    // Called like:  http://project.loc/authors-service/guide-authors
    // With filters: http://project.loc/authors-service/guide-authors?filter_args={"tid":"7"}
    this.fetchAuthors = function(reset) {

      var params = $scope.guideAuthors.viewParams;

      var data = ViewService.get({
        view_endpoint: 'authors-service', 
        view_path:     'guide-authors',
        filter_args:   params.args, 
        limit:         params.limit, 
        page:          params.page,
        offset:        params.offset
      },
      function (data) {
        $scope.guideAuthors.lastPage = Math.ceil(data.total_rows / data.limit) - 1;
        $scope.guideAuthors.currentPage = data.current_page;
        $scope.guideAuthors.processAuthors(data, reset);
      });
    };


    // Add authors to the View
    this.processAuthors = function(data, reset) {
      // Is authors set?
      if ($scope.guideAuthors.authors == undefined) {
        $scope.guideAuthors.authors = [];
      }
      
      // If we are not resetting, concatenate results
      if (!reset) {
        $scope.guideAuthors.authors = $scope.guideAuthors.authors.concat(data.results);  
      }
      
      // Clear results
      else {
        $scope.guideAuthors.currentPage = 0;
        $scope.guideAuthors.authors = data.results;
      }
    };


    // Register the click and broadcast to all listeners
    this.authorClick = function(event, uid, name) {
      $rootScope.$broadcast('authorChanged', {uid:uid,name:name});
    };


    // Primitive (more) pager
    this.moreAuthors = function() {
      $scope.guideAuthors.viewParams.page = Number($scope.guideAuthors.currentPage) + 1;
      $scope.guideAuthors.fetchAuthors();
    };


    // Initialize the controller
    (function init() {
      $scope.guideAuthors.fetchAuthors();
    }());
}]);
