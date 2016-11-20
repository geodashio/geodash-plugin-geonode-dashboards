geodash.controllers.DashboardsControllerModalWelcome = function($scope, $element, $controller, $interpolate)
{
  angular.extend(this, $controller('GeoDashControllerModal', {$element: $element, $scope: $scope}));

  var m = $.grep(geodash.meta.modals, function(x, i){ return x['name'] == 'dashboards_welcome';})[0];
  $scope.config = m.config;
  $scope.ui = m.ui;
  $scope.showOptions = geodash.ui.showOptions;
  $scope.updateValue = geodash.util.updateValue;

  var mainScope = $element.parents(".geodash-dashboard:first").isolateScope();
  $scope.dashboard = mainScope.dashboard;
  $scope.state = mainScope.state;

  $scope.clearSelection = function(id)
  {
    $("#"+id).val(null);
    $("#"+id).typeahead("close");
  };

  $scope.href = function(page)
  {
    var url = undefined;
    if(angular.isString($scope.next) && $scope.next.length > 0)
    {
      var page = geodash.api.getPage(page)
      if(angular.isDefined(page))
      {
        url = $interpolate(page)({"dashboard": $scope.next });
      }
    }
    return url;
  };

};
