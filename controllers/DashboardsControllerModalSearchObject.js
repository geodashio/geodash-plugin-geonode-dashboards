geodash.controllers.DashboardsControllerModalSearchObject = function($scope, $element, $controller)
{

  angular.extend(this, $controller('GeoDashControllerModal', {$element: $element, $scope: $scope}));
  //////////////////////////////////
  var m = $.grep(geodash.meta.modals, function(x, i){ return x['name'] == 'search_object';})[0];
  $scope.config = m.config;
  $scope.ui = m.ui;
  //////////////////////////////////
  $scope.html5data = geodasheditor.html5data;
  $scope.updateValue = geodash.util.updateValue;
  //////////////////////////////////
  $scope.showOptions = geodash.ui.showOptions;
  //////////////////////////////////
  //////////////////////////////////

  $scope.validateFields = function(field_flat_array)
  {
    for(var i = 0; i < field_flat_array.length; i++)
    {
      $scope.validateField(field_flat_array[i]);
    }
  };

  $scope.validateField = function(field_flat)
  {
    $scope.updateValue(
      field_flat,
      $scope.workspace_flat,
      $scope.workspace);

    $scope["object"] = extract(
      expand($scope.path_array),
      $scope.workspace);
  };

};
