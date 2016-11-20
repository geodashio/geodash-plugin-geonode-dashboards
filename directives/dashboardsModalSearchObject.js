geodash.directives.dashboardsModalSearchObject = function(){
  return {
    controller: geodash.controllers.DashboardsControllerModalSearchObject,
    restrict: 'EA',
    replace: true,
    scope: {},
    //scope: true,
    templateUrl: 'dashboards_modal_search_object.tpl.html',
    link: function ($scope, element, attrs){}
  };
};
