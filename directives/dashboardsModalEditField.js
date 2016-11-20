geodash.directives.dashboardsModalEditField = function(){
  return {
    controller: geodash.controllers.DashboardsControllerModalEditField,
    replace: true,
    //require: undefined,
    restrict: 'EA',
    scope: {},
    //scope: true,
    templateUrl: 'dashboards_modal_edit_field.tpl.html',
    link: function ($scope, element, attrs){}
  };
};
