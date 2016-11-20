geodash.directives.dashboardsSidebarEditor = function(){
  return {
    controller: geodash.controllers.DashboardsControllerSidebarEditor,
    restrict: 'EA',
    replace: true,
    scope: {},
    templateUrl: 'dashboards_sidebar_editor.tpl.html',
    link: function (scope, element, attrs, controller, transcludeFn)
    {
      setTimeout(function(){

        $('[data-toggle="tooltip"]', element).tooltip();

        geodash.init.typeahead(
          element,
          scope.workspace.config.featurelayers,
          scope.workspace.config.baselayers,
          scope.workspace.config.servers);

      },0);
    }
  };
};
