(function (angular) {
  'use strict';
  
  var appPath = '/sites/all/modules/custom/ng_panes/plugins/content_types/ng_guide_list';
  
  // Define the app
  var guideListApp = angular.module('guideListApp', [
    'ngResource'
  ]);
  
  console.log(guideListApp);
  
}(window.angular));