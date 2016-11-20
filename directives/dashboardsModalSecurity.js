geodash.directives.dashboardsModalSecurity = function(){
  return {
    controller: geodash.controllers.DashboardsControllerModalSecurity,
    restrict: 'EA',
    replace: true,
    scope: {},
    templateUrl: 'dashboards_modal_security.tpl.html',
    link: function ($scope, element, attrs){}
  };
};
