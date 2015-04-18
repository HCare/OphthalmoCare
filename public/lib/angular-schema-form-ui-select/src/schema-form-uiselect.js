angular.module('schemaForm').config(
['schemaFormProvider', 'schemaFormDecoratorsProvider', 'sfPathProvider',
  function(schemaFormProvider,  schemaFormDecoratorsProvider, sfPathProvider) {

    var uiselect = function(name, schema, options) {
      if (schema.type === 'string' && schema.format == 'uiselect') {
        var f = schemaFormProvider.stdFormObj(name, schema, options);
        f.key  = options.path;
        f.type = 'uiselect';
        options.lookup[sfPathProvider.stringify(options.path)] = f;
        return f;
      }
    };

    schemaFormProvider.defaults.string.unshift(uiselect);

    var uiselect = function(name, schema, options) {
      if (schema.type === 'number' && schema.format == 'uiselect') {
        var f = schemaFormProvider.stdFormObj(name, schema, options);
        f.key  = options.path;
        f.type = 'uiselect';
        options.lookup[sfPathProvider.stringify(options.path)] = f;
        return f;
      }
    };

    schemaFormProvider.defaults.number.unshift(uiselect);

    var uimultiselect = function(name, schema, options) {
      if (schema.type === 'array' && schema.format == 'uiselect') {
        var f = schemaFormProvider.stdFormObj(name, schema, options);
        f.key  = options.path;
        f.type = 'uimultiselect';
        options.lookup[sfPathProvider.stringify(options.path)] = f;
        return f;
      }
    };
    schemaFormProvider.defaults.array.unshift(uimultiselect);


  //Add to the bootstrap directive
    schemaFormDecoratorsProvider.addMapping('bootstrapDecorator', 'uiselect',
    'directives/decorators/bootstrap/uiselect/single.html');
    schemaFormDecoratorsProvider.createDirective('uiselect',
    'directives/decorators/bootstrap/uiselect/single.html');
    schemaFormDecoratorsProvider.addMapping('bootstrapDecorator', 'uimultiselect',
    'directives/decorators/bootstrap/uiselect/multi.html');
    schemaFormDecoratorsProvider.createDirective('uimultiselect',
    'directives/decorators/bootstrap/uiselect/multi.html');
  }])
  .directive("toggleSingleModel", function() {
    // some how we get this to work ...
    return {
      require: 'ngModel',
      restrict: "A",
      scope: {},
      replace: true,
      controller: ['$scope', function($scope)  {
        $scope.$parent.$watch('select_model.selected',function(){
          if($scope.$parent.select_model.selected != undefined) {
            $scope.$parent.insideModel = $scope.$parent.select_model.selected.value;
            $scope.$parent.ngModel.$setViewValue($scope.$parent.select_model.selected.value);
          }
        });
      }],
    };
  })
  .directive("toggleModel", function() {
    // some how we get this to work ...
    return {
      require: 'ngModel',
      restrict: "A",
      scope: {},
      replace: true,
      controller: ['$scope','sfSelect', function($scope,  sfSelect)  {
        var list = sfSelect($scope.$parent.form.key, $scope.$parent.model);
        //as per base array implemenation if the array is undefined it must be set as empty for data binding to work
        if (angular.isUndefined(list)) {
            list = [];
            sfSelect($scope.$parent.form.key, $scope.$parent.model, list);
        }
        $scope.$parent.$watch('form.select_models',function(){
          if($scope.$parent.form.select_models.length == 0) {
            $scope.$parent.insideModel = $scope.$parent.$$value$$;
            if($scope.$parent.ngModel.$viewValue != undefined) {
              $scope.$parent.ngModel.$setViewValue($scope.$parent.form.select_models);
            }
          } else {
            $scope.$parent.insideModel = $scope.$parent.form.select_models;
            $scope.$parent.ngModel.$setViewValue($scope.$parent.form.select_models);
          }
        }, true);
      }],
    };
  })
  .filter('whereMulti', function() {
    return function(items, key, values) {
      var out = [];

      if (angular.isArray(values)) {
        values.forEach(function(value) {
          for (var i = 0; i < items.length; i++) {
            if (value == items[i][key]) {
              out.push(items[i]);
              break;
            }
          }
        });
      } else {
        // Let the output be the input untouched
        out = items;
      }

      return out;
    };
  })
  .filter('propsFilter', function() {
    return function(items, props) {
      var out = [];

      if (angular.isArray(items)) {
        items.forEach(function(item) {
          var itemMatches = false;

          var keys = Object.keys(props);
          for (var i = 0; i < keys.length; i++) {
            var prop = keys[i];
            if (item.hasOwnProperty(prop)){
              //only match if this property is actually in the item to avoid
              var text = props[prop].toLowerCase();
              //search for either a space before the text or the textg at the start of the string so that the middle of words are not matched
              if (item[prop].toString().toLowerCase().indexOf(text) === 0 || ( item[prop].toString()).toLowerCase().indexOf(' ' + text) !== -1  ) {
                itemMatches = true;
                break;
              }
            }
          }

          if (itemMatches) {
            out.push(item);
          }
        });
      } else {
        // Let the output be the input untouched
        out = items;
      }

      return out;
    };
  })
  .controller('UiSelectController', ['$scope', '$http', function($scope, $http) {
    
    $scope.fetchResult = function (schema, options, search) {
        if(options) {
          if (options.callback) {
              schema.items = options.callback(schema, options, search);
              console.log('items', schema.items);
          }
          else if (options.http_post) {
              return $http.post(options.http_post.url, options.http_post.parameter).then(
                  function (_data) {
                      schema.items = _data.data;
                      console.log('items', schema.items);
                  },
                  function (data, status) {
                      alert("Loading select items failed (URL: '" + String(options.http_post.url) +
                          "' Parameter: " + String(options.http_post.parameter) + "\nError: "  + status);
                  });
          }
          else if (options.http_get) {
              return $http.get(options.http_get.url, options.http_get.parameter).then(
                  function (_data) {
                      schema.items = _data.data;
                      console.log('items', schema.items);
                  },
                  function (data, status) {
                      alert("Loading select items failed (URL: '" + String(options.http_get.url) +
                          "\nError: "  + status);
                  });
          }
          else if (options.async) {
              return options.async.call(schema, options, search).then(
                  function (_data) {
                      schema.items = _data.data;
                      console.log('items', schema.items);
                  },
                  function (data, status) {
                      alert("Loading select items failed(Options: '" + String(options) +
                          "\nError: "  + status);
                  });
          }
          
        }
    };
  }])
