// The toolkit service is where useful tidbits are kept
//  use only if wearing eye protection and a hard hat.
angular.module('app').factory('ToolKit', function() {
  var toolkit = {};
  
  // Is this the last item? Return last class
  toolkit.isLast = function(check, cls) {
    if (check === undefined) check = false;
    var cssClass = check ? cls : null;
    return cssClass;
  };
  
  // NOTE: It may make more sense to move this into menu_service!
  // Build links from the service call
  toolkit.buildLinks = function(links) {
    var l = links.tree;
    var set = [];
    for (var key in l) {
      if (l.hasOwnProperty(key)) {
        set.push({
          path: '/'+l[key].link.path,
          title: l[key].link.title,
          weight: Number(l[key].link.weight)
        });
      }
    }
    return _.sortBy(set, 'weight');
  };
  
  // Fetch the appPath
  toolkit.appPath = function() {
    return '/sites/all/themes/ngTheme/ngApp';
  };
    
  return toolkit;

});
