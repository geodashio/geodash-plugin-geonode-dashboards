geodash.directives.dashboardsModalConfig = function(){
  return {
    controller: geodash.controllers.DashboardsControllerModalConfig,
    restrict: 'EA',
    replace: true,
    scope: {},
    templateUrl: 'dashboards_modal_config.tpl.html',
    link: function ($scope, element, attrs){}
  };
};
