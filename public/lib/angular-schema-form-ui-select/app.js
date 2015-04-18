/*global angular */
'use strict';

/**
 * The main app module
 * @name app
 * @type {angular.Module}
 */
var lightApp = angular.module('lightApp', ['angular-underscore/filters', 'schemaForm', 'pascalprecht.translate', 'ui.select', 'ui.sortable'])
.config(['$controllerProvider', '$compileProvider', '$filterProvider', '$provide', function ($controllerProvider, $compileProvider, $filterProvider, $provide) {

    // Notice that the registration methods on the
    // module are now being overridden by their provider equivalents

    lightApp.controller = $controllerProvider.register;
    lightApp.directive  = $compileProvider.directive;
    lightApp.filter     = $filterProvider.register;
    lightApp.factory    = $provide.factory;
    lightApp.service    = $provide.service;

}])
.controller('SelectController', ['$scope', '$http', function($scope, $http){
  $scope.refreshSelect = function(schema, options, search) {
    console.log('refreshSelect is called');
    return [
      { value: 'refreshed1', label: 'refreshed1'},
      { value: 'refreshed2', label: 'refreshed2'},
      { value: 'refreshed3', label: 'refreshed3'}
    ];
  }

  $scope.refreshSelectAsync = function(schema, options, search) {
    console.log('refreshSelectAsync is called');
    return $http.get(options.async.url);
  }

  $scope.tagFunction = function(content){
    var item = {
      value: content,
      label: content,
      description : '',
      group: ''
    }
    return item;
  };

  $scope.schema = {
    type: 'object',
    title: 'Select',
    properties: {
      name: {
        title: 'Name',
        type: 'string'
      },
      staticselect: {
        title: 'Static Single Select',
        type: 'string',
        format: 'uiselect',
        description: 'Only single item is allowed',
        items: [
          { value: 'one', label: 'label1'},
          { value: 'two', label: 'label2'},
          { value: 'three', label: 'label3'}
        ]
      },
      numberselect: {
        title: 'Static Number Select',
        type: 'number',
        format: 'uiselect',
        description: 'Only single item is allowed',
        items: [
          { value: 1, label: 'number1'},
          { value: 2, label: 'number2'},
          { value: 3, label: 'number3'}
        ]
      },
      dyanmicselect: {
        title: 'Dynamic Single Select',
        type: 'string',
        format: 'uiselect',
        description: 'Only single item is allowed',
        items: [
          { value: 'one', label: 'label1'},
          { value: 'two', label: 'label2'},
          { value: 'three', label: 'label3'}
        ]
      },
      staticmultiselect: {
        title: 'Static Multi Select',
        type: 'array',
        format: 'uiselect',
        description: 'Multi single items arre allowed',
        minItems: 1,
        maxItems: 4,
        items: [
          { value: 'one', label: 'label1'},
          { value: 'two', label: 'label2'},
          { value: 'three', label: 'label3'},
          { value: 'four', label: 'label4'},
          { value: 'five', label: 'label5'}
        ]
      },
      dynamicmultiselect: {
        title: 'Dyanmic Multi Select',
        type: 'array',
        format: 'uiselect',
        description: 'Multi single items arre allowed',
        minItems: 1,
        maxItems: 2,
        items: [
          { value: 'one', label: 'label1'},
          { value: 'two', label: 'label2'},
          { value: 'three', label: 'label3'},
          { value: 'four', label: 'label4'},
          { value: 'five', label: 'label5'}
        ]
      },
      asyncselect: {
        title: 'Load Json Async Single Select',
        type: 'string',
        format: 'uiselect',
        description: 'Only single item is allowed'
      },
      multiselect_get: {
        title: 'Dyanmic Multi Select HTTP Get CORS',
        type: 'array',
        format: 'uiselect',
        description: 'Multi single items arre allowed',
        minItems: 1,
        maxItems: 2
      },
      multiselect_post: {
        title: 'Dyanmic Multi Select HTTP Post CORS',
        type: 'array',
        format: 'uiselect',
        description: 'Multi single items arre allowed',
        minItems: 1,
        maxItems: 2
      },
      descriptions: {
        title: 'Multi Select with descriptions and without Search on the description field.',
        type: 'array',
        format: 'uiselect',
        description: 'Multi single items arre allowed',
        minItems: 1,
        maxItems: 4,
        items: [
          { value: 'label1', label: 'label1', description: 'a long description to provide context that is not useful for search'},
          { value: 'label2', label: 'label2', description: 'a different long description to provide context that is not useful for search'},
          { value: 'label3', label: 'label3', description: 'a further long description to provide context that is not useful for search'},
          { value: 'label4', label: 'label4', description: 'another long description to provide context that is not useful for search'},
          { value: 'label5', label: 'label5', description: 'yet another long description to provide context that is not useful for search'}
        ]
      },
      descriptions_search: {
        title: 'Multi Select with search on descriptions',
        type: 'array',
        format: 'uiselect',
        description: 'Multi single items arre allowed, search on description',
        minItems: 1,
        items: [
          { group:'North America', value: 'us', label: 'Canada', description: ''},
          { group:'North America', value: 'cn', label: 'USA' , description: 'US, USA, United States of America'},
          { group:'Europe', value: 'gb', label: 'UK' , description: 'United Kingdom, Great Britain, GB'},
          { group:'Europe', value: 'nl', label: 'Holland' , description: 'Netherlands, NL, Nederland, Pays-Bas'}
        ]
      },
      tagging: {
        title: 'Tagging',
        type: 'array',
        format: 'uiselect',
        description: 'Hit enter or comma to create a new iootem in the dropdown',
        minItems: 1,
        maxItems: 2,
        items: [
          { value: 'one', label: 'label1'},
          { value: 'two', label: 'label2'},
          { value: 'three', label: 'label3'},
          { value: 'four', label: 'label4'},
          { value: 'five', label: 'label5'}
        ]
      },
      grouping: {
        title: 'Multi Select with grouping',
        type: 'array',
        format: 'uiselect',
        description: 'Can be empty',
        minItems: 0,
        items: [
          { group:'North America', value: 'us', label: 'Canada'},
          { group:'North America', value: 'cn', label: 'USA' },
          { group:'Europe', value: 'gb', label: 'UK' },
          { group:'Europe', value: 'nl', label: 'Holland'}
        ]
      },
      grouping_and_tagging: {
        title: 'Grouping with Tagging',
        type: 'array',
        format: 'uiselect',
        description: 'Hit enter or comma to create a new item in the dropdown',
        minItems: 1,
        maxItems: 2,
        items: [
          { group:'North America', value: 'us', label: 'Canada'},
          { group:'North America', value: 'cn', label: 'USA' },
          { group:'Europe', value: 'gb', label: 'UK' },
          { group:'Europe', value: 'nl', label: 'Holland'}
        ]
      },
      single_grouping_and_tagging: {
        title: 'Single Select with Grouping with Tagging',
        type: 'string',
        format: 'uiselect',
        description: 'Hit enter or comma to create a new item in the dropdown',
        minItems: 1,
        maxItems: 2,
        items: [
          { group:'North America', value: 'us', label: 'Canada'},
          { group:'North America', value: 'cn', label: 'USA' },
          { group:'Europe', value: 'gb', label: 'UK' },
          { group:'Europe', value: 'nl', label: 'Holland'}
        ]
      },
      single_tagging: {
        title: 'Tagging',
        type: 'string',
        format: 'uiselect',
        description: 'Hit enter or comma to create a new iootem in the dropdown',
        minItems: 1,
        maxItems: 2,
        items: [
          { value: 'one', label: 'label1'},
          { value: 'two', label: 'label2'},
          { value: 'three', label: 'label3'},
          { value: 'four', label: 'label4'},
          { value: 'five', label: 'label5'}
        ]
      },
    },
    required: ['staticselect', 'numberselect', 'dyanmicselect', 'staticmultiselect', 'dynamicmultiselect', 'asyncselect', 'multiselect_get', 'multiselect_post']
  };
  $scope.form = [
    'name',
     {
       key: 'staticselect',
       options: {
         uiClass: 'short'
       }
     },
     'numberselect',
     {
       key: 'dyanmicselect',
       options: {
         refreshDelay: 100,
         callback: $scope.refreshSelect
       }
     },
     {
       key: 'single_tagging',
       options: {
          tagging: $scope.tagFunction ,
          taggingLabel: '(adding new)',
          taggingTokens: 'ENTER|,'
       }
     },
      {
       key: 'single_grouping_and_tagging',
       options: {
        groupBy : 'group',
          tagging: $scope.tagFunction ,
          taggingLabel: '(adding new)',
          taggingTokens: 'ENTER|,'
       }
     },
     {
       key: 'staticmultiselect'
     },
     {
       key: 'dynamicmultiselect',
       options: {
         uiClass: 'short',
         refreshDelay: 100,
         callback: $scope.refreshSelect
       }
      },
     {
       key: 'asyncselect',
       options: {
           async: {
               call: $scope.refreshSelectAsync,
               url : "/test/testdata.json"
           }
       }
     },
     {
       key: 'multiselect_get',
       options: {
           http_get: {
               url : "http://www.networknt.com/api/rs?cmd={\"category\": \"demo\", \"name\": \"getDropdown\", \"readOnly\": true}"
           }
       }
     },
     {
       key: 'multiselect_post',
       options: {
           http_post: {
               url : "http://www.networknt.com/api/rs",
               parameter: { category: "demo",  name: "getDropdown", readOnly: true}
           }
       }
     },
     'descriptions',
     {
       key: 'descriptions_search',
       options:{
          searchDescriptions : true
       }
     },
     {
       key: 'tagging',
       options: {
          tagging: $scope.tagFunction ,
          taggingLabel: '(adding new)',
          taggingTokens: 'ENTER|,'
       }
     },
     {
       key: 'grouping',
       options: {
          groupBy : 'group'
       }
     },
      {
       key: 'grouping_and_tagging',
       options: {
        groupBy : 'group',
          tagging: $scope.tagFunction ,
          taggingLabel: '(adding new)',
          taggingTokens: 'ENTER|,'
       }
     }
  ];
  $scope.model = {
    numberselect: 1,
    staticmultiselect: ['three', 'one']
  };
  $scope.submitted = function(form){
    $scope.$broadcast('schemaFormValidate')
    console.log($scope.model);
  };
}]);
