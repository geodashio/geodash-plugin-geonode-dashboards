geodash.directives.dashboardsModalWelcome = function(){
  return {
    controller: geodash.controllers.DashboardsControllerModalWelcome,
    restrict: 'EA',
    replace: true,
    scope: {},
    templateUrl: 'dashboards_modal_welcome.tpl.html',
    link: function ($scope, element, attrs){

      setTimeout(function(){

        //var datasets = [sparc2.typeahead.datasets, geodash.typeahead.datasets];
        //var codecs = [sparc2.bloodhound.codec, geodash.bloodhound.codec];

        geodash.init.typeahead(
          element,
          undefined,
          undefined,
          undefined,
          geodash.config.search.datasets,
          geodash.config.search.codecs
        );

        var main_scope = geodash.util.getScope("geodash-main");
        var modal_scope = geodash.util.getScope("geodash-modal-dashboards-welcome");
        modal_scope.$apply(function(){

          modal_scope.push({ "welcome": extract("welcome", main_scope.config || main_scope.map_config) });
          setTimeout(function(){ $("#geodash-modal-dashboards-welcome").modal({'backdrop': 'static'}); }, 0);

        });

      }, 10);

    }
  };
};
