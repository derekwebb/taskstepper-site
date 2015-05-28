//var guideListControllers = angular.module('guideListControllers', []);

// Will initialize a listing of Guides
angular.module('guideListApp').controller('GuideListCtrl', ['$scope', function($scope) {
  console.log('Firing scope');
  this.guideList = 'Guide list';
  $scope.guideList = 'Guide_list';
}]);
