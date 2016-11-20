geodash.controllers.GeoDashControllerSidebarEditor = function(
  $scope, $element, $controller, $interpolate, $timeout,
  $http, $cookies,
  dashboard_schema, editor_schema, security_schema)
{
  angular.extend(this, $controller('GeoDashControllerBase', {$element: $element, $scope: $scope}));
  /////////////////////
  var mainScope = $element.parents(".geodash-dashboard:first").isolateScope();
  /////////////////////
  $scope.config = {
    "that" : {
      "id": "geodash-sidebar-right"
    },
    "html5data": {
      "modal_dashboard_config": {
        "id": "geodash-modal-dashboard-config",
        "dynamic": {
          "workspace": ["source", "workspace"],
          "workspace_flat": ["source", "workspace_flat"]
        }
      },
      "modal_dashboard_security": {
        "id": "geodash-modal-dashboard-security",
        "dynamic": {
          "workspace": ["source", "workspace"],
          "workspace_flat": ["source", "workspace_flat"]
        }
      }
    }
  };
  /////////////////////
  $scope.perms = extract("perms", geodash);
  $scope.editor = geodash.util.deepCopy(editor_schema);
  /////////////////////
  // Accessible by Editor
  //$scope.stack.backtrace.push();
  $scope.update_stack([$scope.expand({
    "workspace": {
      "config": angular.extend({}, mainScope.dashboard),
      "security": geodash.initial_data["data"]["security"]
    },
    "schema": {
      "config": geodash.util.deepCopy(dashboard_schema),
      "security": geodash.util.deepCopy(security_schema)
    },
    "path": ""
  })]);
  $scope.update_main();
  //$scope.;
  //$scope.workspace_flat = geodash.util.flatten($scope.workspace, undefined);
  //$scope.;
  //$scope.schema_flat = geodash.util.flatten($scope.schema, undefined);
  //$scope.path = "";
  //$scope.path_flat = "";
  //$scope.path_array = [];
  /////////////////////
  $scope.fields_by_pane = {};
  $scope.value_edit_field = null;

  $scope.html5data = geodasheditor.html5data;

  $scope.updateVariables = function(){

    var fields_by_pane = [];
    for(var i = 0; i < $scope.editor.panes.length; i++)
    {
        var pane = $scope.editor.panes[i];
        var fields_all = [];

        if("fields" in pane && angular.isArray(pane.fields))
        {
          fields_all = fields_all.concat(pane.fields);
        }

        if("section" in pane && pane.section in $scope.schema.config)
        {
          fields_all = fields_all.concat($.map($scope.schema.config[pane.section], function(value, key){
            return pane.section+"."+key;
          }));
        }

        fields_by_pane.push({'id': pane.id, 'fields': fields_all});
    }
    $scope.fields_by_pane = fields_by_pane;
  };
  $scope.updateVariables();
  $scope.$watch('dashboard', $scope.updateVariables);
  $scope.$watch('editor', $scope.updateVariables);
  $scope.$watch('schema', $scope.updateVariables);

  var jqe = $($element);

  $scope.edit_field_root = function(path)
  {
    var ws = $scope.stack.head.workspace;
    var schema = $scope.stack.head.schema;
    var fieldType = extract((path+".type").split("."), schema);
    var x = {
      'modal': (fieldType == "object" ? 'geodash-modal-edit-object' : 'geodash-modal-edit-field'),
      'prev': undefined,
      'workspace': ws,
      'schema': schema,
      'basepath': path,
      'basepath_array': path.split("."),
      'schemapath': path,
      'objectIndex': undefined
    };
    console.log('New X:');
    console.log(x);

    geodash.util.getScope(x.modal).push(x, []);
    $("#"+x.modal).modal({'backdrop': 'static','keyboard':false});
    $("#"+x.modal).modal('show');
    $timeout(function(){
      geodash.ui.update(x.modal);
      var modalElement = $("#"+x.modal);
      var tabs = modalElement.find('.nav-tabs li');
      tabs.slice(0, 1).addClass('active');
      tabs.slice(1).removeClass('active');
      var panes = modalElement.find('.tab-pane');
      panes.slice(0, 1).addClass('in active');
      panes.slice(1).removeClass('in active');
    },0);
  };



  $scope.validateFields = function(field_flat_array)
  {
    for(var i = 0; i < field_flat_array.length; i++)
    {
      $scope.validateField(field_flat_array[i]);
    }
  };
  $scope.validateField = function(field_flat)
  {
    // Update dashboard
    if(field_flat.indexOf("__") == -1)
    {
      $scope.workspace[field_flat] = $scope.workspace_flat[field_flat];
    }
    else
    {
      var keyChain = field_flat.split("__");
      var target = $scope.workspace;
      for(var j = 0; j < keyChain.length -1 ; j++)
      {
        var newKey = keyChain[j];
        if(!(newKey in target))
        {
          var iTest = -1;
          try{iTest = parseInt(keyChain[j+1], 10);}catch(err){iTest = -1;};
          target[newKey] = iTest >= 0 ? [] : {};
        }
        target = target[newKey];
      }
      var finalKey = keyChain[keyChain.length-1];
      if(angular.isArray(target))
      {
        if(finalKey >= target.length)
        {
          var zeros = finalKey - target.length;
          for(var k = 0; k < zeros; k++ )
          {
            target.push({});
          }
          target.push($scope.workspace_flat[field_flat]);
        }
      }
      else
      {
        target[finalKey] = $scope.workspace_flat[field_flat];
      }
    }
  };

  //$scope.showOptions = function($event, field, field_flat)
  // $("#editor-field-"+field_flat);

  $scope.addToField = function($event, field, field_flat)
  {
    var currentValue = extract(field.split("."), $scope.workspace);
    if(Array.isArray(currentValue))
    {
      var valueToAdd = $("#editor-field-"+field_flat).val();
      if(angular.isString(valueToAdd) && valueToAdd != "")
      {
        var newValue = currentValue.push(valueToAdd);
        $scope.workspace[field] = newValue;
        $.each(geodash.util.flatten(newValue), function(i, x){
          $scope.workspace_flat[field_flat+"__"+i] = x;
        });
      }
    }
    else if(angular.isString(currentValue))
    {
      var valueToAdd = $("#editor-field-"+field_flat).val();
      if(angular.isString(valueToAdd) && valueToAdd != "")
      {
        $scope.workspace_flat[field_flat] = currentValue + "," + valueToAdd;
        $scope.validateField(field_flat);
      }
    }
    else if(angular.isNumber(currentValue))
    {
      var valueToAdd = $("#editor-field-"+field_flat).val();
      if(angular.isString(valueToAdd) && valueToAdd != "")
      {
        $scope.workspace_flat[field_flat] = currentValue + parseFloat(valueToAdd);
        $scope.validateField(field_flat);
      }
    }
    $("#editor-field-"+field_flat).val(null);
    try{
      $("#editor-field-"+field_flat).typeahead('val', null);
      $("#editor-field-"+field_flat).typeahead('close');
    }catch(err){}
  };

  $scope.saveConfig = function($event)
  {
    var slug = extract("state.slug", geodash.util.getScope("geodash-main"));
    if(window.confirm("Are you sure you want to save?"))
    {
      var httpConfig = {
          'headers': {
            'Content-Type': 'application/json',
            'X-CSRFToken': $cookies['csrftoken']
          }
      };
      var payload = {
        'config': $scope.workspace.config,
        'security': $scope.workspace.security
      };

      $http.post($interpolate(geodash.api.getEndpoint('save'))({'slug': slug}), payload, httpConfig).success(function(data)
      {
        console.log(data);
        if(data.success)
        {
          if(data.config.slug != slug)
          {
            var template = geodash.api.getPage("dashboard");
            if(template != undefined)
            {
              window.location.href = $interpolate(template)({ 'slug': data.config.slug });
            }
          }
          else
          {
            location.reload();
          }
        }
        else
        {
            window.alert(data.message);
        }
      });
    }
  };

  $scope.saveAsConfig = function($event)
  {
    var slug = extract("state.slug", geodash.util.getScope("geodash-main"));
    if(window.confirm("Are you sure you want to save as a new dashboard?  Old one will still exist at old slug."))
    {
      if($scope.workspace.config.slug == slug)
      {
        alert("Cannot save as.  Need to specify new unique slug.");
        return 1;
      }

      var httpConfig = {
          'headers': {
            'Content-Type': 'application/json',
            'X-CSRFToken': $cookies['csrftoken']
          }
      };
      var payload = {
        'config': $scope.workspace.config,
        'security': $scope.workspace.security
      };
      $http.post(geodash.api.getEndpoint('saveas'), payload, httpConfig).success(function(data)
      {
        console.log(data);
        if(data.success)
        {
          var template = geodash.api.getPage("dashboard");
          if(template != undefined)
          {
            window.location.href = $interpolate(template)({ 'slug': data.config.slug });
          }

        }
        else
        {
            window.alert(data.message);
        }
      });
    }
  };
};
