geodash.directives.dashboardsModalEditObject = function(){
  return {
    controller: geodash.controllers.DashboardsControllerModalEditObject,
    restrict: 'EA',
    replace: true,
    scope: {},
    //scope: true,
    templateUrl: 'dashboards_modal_edit_object.tpl.html',
    link: function ($scope, element, attrs){}
  };
};
