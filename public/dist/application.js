'use strict';
// Init the application configuration module for AngularJS application
var ApplicationConfiguration = function () {
    //console.log('config');
    // Init module configuration options
    var applicationModuleName = 'ophthalmocare';
    var applicationModuleVendorDependencies = [
        'ngResource',
        'ngCookies',
        'ngAnimate',
        'ngTouch',
        'ngSanitize',
        'ui.router',
        'ui.bootstrap',
        'ui.utils',
        'ngLodash',
        'angular-loading-bar',
        'toaster',
        'webcam',
        'akoenig.deckgrid',
        'ngImgCrop',
        'angularMoment',
        'angularFileUpload',
        'pascalprecht.translate',
        'ui.select',
        'schemaForm'
      ];
    // Add a new vertical module
    var registerModule = function (moduleName, dependencies) {
      //console.log('register module : '+moduleName);
      // Create angular module
      angular.module(moduleName, dependencies || []);
      // Add the module to the AngularJS configuration file
      angular.module(applicationModuleName).requires.push(moduleName);
    };
    return {
      applicationModuleName: applicationModuleName,
      applicationModuleVendorDependencies: applicationModuleVendorDependencies,
      registerModule: registerModule
    };
  }();'use strict';
//Start by defining the main module and adding the module dependencies
/*angular.module('security', []*/
/*, function(){console.log('first')}*/
/*);
angular.module('security').provider('auth',
    function () {
        console.log('register security provider');
        var _string = '';

        var config = function configFn(str) {
            console.log(str);
            auth.authorize();
            console.log(str);
            _string = str;
        };

        var auth=function authFn($q, $timeout, $resource, $location){
            return{
                authorize:function () {
                    //alert('call');
                    console.log('authorize');
                    console.log($q);
                    var deferred = $q.defer();
                    console.log('sssssssss');
                    // Make an AJAX call to check if the user is logged in
                    $resource('/auth/is-authorized/list_roles').get().$promise.then(function (response) {
                        console.log('success');
                        //alert('success');
                        console.log(JSON.stringify(response));
                        //alert(JSON.stringify(response));
                        deferred.resolve();
                    }, function (errorResponse) {
                        ///log error message
                        console.log('error');
                        //alert('error');
                        //alert(JSON.stringify(errorResponse));
                        console.log(JSON.stringify(errorResponse));
                        deferred.reject();
                        $location.url('/');
                        //$scope.error = errorResponse.data.message;
                    });
                }
            }
        };
        return{
            $get:auth,
            config: config
        };


    });*/
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);
// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config([
  '$locationProvider',
  function ($locationProvider) {
    //console.log('config app module');
    $locationProvider.hashPrefix('!');
  }
]);
//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //console.log('ready');
  //Fixing facebook bug with redirect
  if (window.location.hash === '#_=_')
    window.location.hash = '#!';
  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});'use strict';
// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('action');'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');'use strict';
// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('directives');'use strict';
// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('examinations');'use strict';
// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('manage-users');'use strict';
// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('module');'use strict';
// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('patients');'use strict';
// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('roles');'use strict';
// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('security');'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');'use strict';
angular.module('action').factory('Action', [
  '$resource',
  function ($resource) {
    // Action service logic
    // ...
    // Public API
    return $resource('action/list');
  }
]);'use strict';
// Setting up route
angular.module('core').config([
  '$stateProvider',
  '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {
    /*console.log('config core module');*/
    // Redirect to home view when route not found
    $urlRouterProvider.otherwise('/');
    // Home state routing
    $stateProvider.state('home', {
      url: '/',
      templateUrl: 'modules/core/views/home.client.view.html'
    });
  }
]);'use strict';
angular.module('core').controller('HeaderController', [
  '$scope',
  'Authentication',
  'Menus',
  '$state',
  'CoreProperties',
  'ActionsHandler',
  'Toolbar',
  function ($scope, Authentication, Menus, $state, CoreProperties, ActionsHandler, Toolbar) {
    $scope.authentication = Authentication;
    $scope.isCollapsed = false;
    $scope.menu = Menus.getMenu('topbar');
    $scope.toolbarCommands = function () {
      return Toolbar.getToolbarCommands();
    };
    $scope.pageTitle = $state.current.title || null;
    $scope.showToolBar = $state.current.url != '/' && $state.current.url != '/signin';
    $scope.pageSubTitle = function () {
      return CoreProperties.getPageSubTitle();
    };
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };
    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
      if (toState.title) {
        $scope.pageTitle = toState.title;
      }
      $scope.showToolBar = toState.url != '/' && toState.url != '/signin';
      $scope.isCollapsed = false;
    });
    $scope.fireCommand = function (command) {
      ActionsHandler.fireAction(command, null);
    };
  }
]);'use strict';
angular.module('core').controller('HomeController', [
  '$scope',
  'Authentication',
  function ($scope, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
  }
]);'use strict';
angular.module('core').factory('CoreProperties', function () {
  var pageSubTitle = null;
  var setPageSubTitle = function (title) {
    pageSubTitle = title;
  };
  var getPageSubTitle = function () {
    return pageSubTitle;
  };
  return {
    setPageSubTitle: setPageSubTitle,
    getPageSubTitle: getPageSubTitle
  };
});
angular.module('core').factory('ActionsHandler', [
  '$rootScope',
  function ($rootScope) {
    var action = {};
    //var _actionName=null;
    action.fireAction = function (actionName, args) {
      //_actionName=actionName;
      $rootScope.$emit(actionName, args);  //console.log('action fired');
    };
    action.onActionFired = function (actionName, scope, func) {
      var unbind = $rootScope.$on(actionName, func);
      //console.log(func);
      scope.$on('$destroy', unbind);  //console.log('action unbind');
    };
    return action;
  }
]);'use strict';
/*
 Created by yass on 9/25/2014.
 */
angular.module('core').factory('Logger', [
  '$log',
  'toaster',
  function ($log, toaster) {
    var logger = {};
    logger.note = function (message, show_toast) {
      $log.log(message);
      if (show_toast) {
        toaster.pop('note', 'Note', message);
      }
    };
    logger.success = function (message, show_toast) {
      $log.info(message);
      if (show_toast) {
        toaster.pop('success', 'Success', message);
      }
    };
    logger.warn = function (message, show_toast) {
      $log.warn(message);
      if (show_toast) {
        toaster.pop('warning', 'Warning', message);
      }
    };
    logger.error = function (message, show_toast) {
      if (Array.isArray(message)) {
        for (var i in message) {
          $log.error(message[i]);
          if (show_toast) {
            toaster.pop('error', 'Error', message[i]);
          }
        }
      } else {
        $log.error(message);
        if (show_toast) {
          toaster.pop('error', 'Error', message);
        }
      }
    };
    logger.debug = function (messsage) {
      $log.debug(messsage);
    };
    return logger;
  }
]);'use strict';
//Menu service used for managing  menus
angular.module('core').service('Menus', [
  'lodash',
  function (lodash) {
    // Define a set of default roles
    this.defaultRoles = ['*'];
    // Define the menus object
    this.menus = {};
    // A private function for rendering decision
    /*var shouldRender = function(user) {
         if (user) {
         if (!!~this.roles.indexOf('*')) {
         return true;
         } else {
         for (var userRoleIndex in user.roles) {
         for (var roleIndex in this.roles) {
         if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
         return true;
         }
         }
         }
         }
         } else {
         return this.isPublic;
         }
         l
         return false;
         };*/
    var shouldRender = function (user) {
      if (user) {
        //console.log(user);
        //console.log(this.action);
        if (this.items) {
          for (var itemIndex in this.items) {
            if (this.items[itemIndex].items) {
              for (var subItemIndex in this.items[itemIndex].items) {
                if (lodash.contains(user._role._actions, this.items[itemIndex].items[subItemIndex].action)) {
                  return true;
                }
              }
            } else if (lodash.contains(user._role._actions, this.items[itemIndex].action)) {
              return true;
            }
          }
        } else if (lodash.contains(user._role._actions, this.action)) {
          return true;
        }
      } else {
        return this.isPublic;
      }
      return false;
    };
    // Validate menu existance
    this.validateMenuExistance = function (menuId) {
      if (menuId && menuId.length) {
        if (this.menus[menuId]) {
          return true;
        } else {
          throw new Error('Menu does not exists');
        }
      } else {
        throw new Error('MenuId was not provided');
      }
      return false;
    };
    // Get the menu object by menu id
    this.getMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Return the menu object
      return this.menus[menuId];
    };
    // Add new menu object by menu id
    this.addMenu = function (menuId, isPublic) {
      // Create the new menu
      this.menus[menuId] = {
        isPublic: isPublic || false,
        items: [],
        shouldRender: shouldRender
      };
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Return the menu object
      delete this.menus[menuId];
    };
    // Add menu item object
    this.addMenuItem = function (menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, position) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Push new menu item
      this.menus[menuId].items.push({
        title: menuItemTitle,
        link: menuItemURL,
        menuItemType: menuItemType || 'item',
        menuItemClass: menuItemType,
        uiRoute: menuItemUIRoute || '/' + menuItemURL,
        isPublic: isPublic === null || typeof isPublic === 'undefined' ? this.menus[menuId].isPublic : isPublic,
        position: position || 0,
        items: [],
        shouldRender: shouldRender
      });
      // Return the menu object
      return this.menus[menuId];
    };
    // Add submenu item object
    this.addSubMenuItem = function (menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, action, position) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
          // Push new submenu item
          this.menus[menuId].items[itemIndex].items.push({
            title: menuItemTitle,
            link: menuItemURL,
            uiRoute: menuItemUIRoute || '/' + menuItemURL,
            isPublic: isPublic === null || typeof isPublic === 'undefined' ? this.menus[menuId].items[itemIndex].isPublic : isPublic,
            action: action === null || typeof action === 'undefined' ? this.menus[menuId].items[itemIndex].action : action,
            position: position || 0,
            shouldRender: shouldRender
          });
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeMenuItem = function (menuId, menuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
          this.menus[menuId].items.splice(itemIndex, 1);
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeSubMenuItem = function (menuId, submenuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
          if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
            this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
          }
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    //Adding the topbar menu
    this.addMenu('topbar', false);
  }
]);'use strict';
//Toolbar service used for managing  toolbar
angular.module('core').service('Toolbar', function () {
  this.commands = [];
  // Add toolbar item
  this.addToolbarCommand = function (commandName, commandAction, CommandTitle, commandIcon, position, redirectUrl, confirmMessage) {
    // Push new menu item
    this.commands.push({
      command: commandName,
      action: commandAction,
      title: CommandTitle,
      icon: commandIcon,
      position: position || 0,
      redirect: redirectUrl || null,
      confirmMsg: confirmMessage || null
    });
    return this.commands;
  };
  // Remove existing toolbar item
  this.removeToolbarCommand = function (commandName) {
    // Search for toolbar item to remove
    for (var itemIndex in this.commands) {
      if (this.commands[itemIndex].command === commandName) {
        this.commands.splice(itemIndex, 1);
      }
    }
    return this.commands;
  };
  this.clearToolbarCommands = function () {
    this.commands = [];
    return this.commands;
  };
  this.getToolbarCommands = function () {
    return this.commands;
  };
});'use strict';
angular.module('directives').directive('hCareActionBtn', [
  'Authentication',
  'lodash',
  function (Authentication, lodash) {
    return {
      restrict: 'E',
      replace: true,
      link: function (scope, element, atts) {
        if (lodash.contains(Authentication.user._role._actions, atts.action)) {
          if (atts.redirectUrl != null && atts.redirectUrl != undefined && atts.redirectUrl != '') {
            atts.$observe('redirectUrl', function (redirectUrl) {
              var buttonText = '<a class="btn btn-default" href=' + redirectUrl + '>' + '<i class="glyphicon glyphicon-' + atts.icon + '"></i>' + '</a>';
              element.html(buttonText);
            });
          }
          if (atts.clickEvent != null && atts.clickEvent != undefined && atts.clickEvent != '') {
            var buttonText = '<a class=\'btn btn-default\' >' + '<i class=\'glyphicon glyphicon-' + atts.icon + '\'></i>' + '</a>';
            element.html(buttonText);
            element.on('click', function () {
              if (atts.responseMessage != null && atts.responseMessage != undefined && atts.responseMessage != '') {
                if (confirm(atts.responseMessage)) {
                  //apply only
                  scope.$apply(atts.clickEvent);
                }
              } else {
                scope.$apply(atts.clickEvent);
              }
            });
          }
        }
      }
    };
  }
]);'use strict';
angular.module('directives').directive('hCareCheckbtnList', [
  'Authentication',
  'lodash',
  function (Authentication, lodash) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        source: '=',
        itemLabelField: '@',
        itemValueField: '@',
        itemClicked: '&',
        selectedItems: '=',
        selectedItemsIds: '@',
        currentTappedItem: '='
      },
      template: '<div class="btn-group" data-toggle="buttons" id={{atts.id}}>' + '<label class="btn btn-primary" ' + 'ng-class="{active:selectedItemsIds  && selectedItemsIds.indexOf(item[itemValueField]) !== -1}"' + 'ng-repeat="item in source"> ' + '<input type="checkbox"' + 'value="{{item[itemLabelField]}}" ' + 'ng-checked="selectedItemsIds  && selectedItemsIds.indexOf(item[itemValueField]) !== -1"' + 'ng-click="itemClicked(item)">{{item[itemLabelField]}}' + '</label>' + '</div>',
      link: function (scope, el, atts) {
        scope.$watch('selectedItems', function (value) {
          scope.selectedItems = scope.selectedItems || [];
          scope.selectedItemsIds = [];
          for (var i in scope.selectedItems) {
            if (!lodash.contains(scope.selectedItemsIds, scope.selectedItems[i][scope.itemValueField])) {
              scope.selectedItemsIds.push(scope.selectedItems[i][scope.itemValueField]);
            }
          }
        }, true);
        scope.itemClicked = function (item) {
          scope.selectedItemsIds = scope.selectedItemsIds || [];
          scope.selectedItems = scope.selectedItems || [];
          if (atts.isActiveOnClick && atts.isActiveOnClick == 'true') {
            if (atts.isMultiSelection && atts.isMultiSelection == 'true') {
              if (!lodash.contains(scope.selectedItemsIds, item[scope.itemValueField])) {
                scope.selectedItemsIds.push(item[scope.itemValueField]);
                scope.selectedItems.push(item);
                scope.currentTappedItem = item;
              } else {
                var index = scope.selectedItemsIds.indexOf(item[scope.itemValueField]);
                scope.selectedItemsIds.splice(index, 1);
                scope.selectedItems.splice(index, 1);
                scope.currentTappedItem = null;
              }
            } else {
              // contains only one item
              if (!lodash.contains(scope.selectedItemsIds, item[scope.itemValueField])) {
                scope.selectedItemsIds = [];
                scope.selectedItems = [];
                scope.selectedItemsIds.push(item[scope.itemValueField]);
                scope.selectedItems.push(item);
                scope.currentTappedItem = item;
              } else {
                var index = scope.selectedItemsIds.indexOf(item[scope.itemValueField]);
                scope.selectedItemsIds.splice(index, 1);
                scope.selectedItems.splice(index, 1);
                scope.selectedItemsIds = [];
                scope.selectedItems = [];
                scope.currentTappedItem = null;
              }
            }
          } else {
            scope.currentTappedItem = item;
          }
        };
      }
    };
  }
]);'use strict';
angular.module('directives').directive('hCareDelButton', [
  'Authentication',
  'lodash',
  function (Authentication, lodash) {
    return {
      restrict: 'E',
      replace: true,
      link: function (scope, el, atts) {
        if (lodash.contains(Authentication.user._role._actions, atts.action)) {
          var buttonText = '<a class=\'btn btn-primary\' ><i class=\'glyphicon glyphicon-trash\'></i></a>';
          el.html(buttonText);
          el.on('click', function () {
            //console.log(typeof atts.hcareDelClick);
            var result = confirm(atts.delMessage);
            if (result) {
              //apply only
              console.log(typeof atts.hcareDelClick);
              scope.$apply(atts.hcareDelClick);
            }
          });
        }
      }
    };
  }
]);'use strict';
angular.module('directives').directive('hCareEditButton', [
  'Authentication',
  'lodash',
  function (Authentication, lodash) {
    return {
      restrict: 'E',
      replace: true,
      scope: { href: '@' },
      link: function (scope, el, atts) {
        if (lodash.contains(Authentication.user._role._actions, atts.action)) {
          atts.$observe('href', function (href) {
            var buttonText = '<a class="btn btn-primary" href=' + href + '>' + '<i class="glyphicon glyphicon-edit"></i>' + '</a>';
            el.html(buttonText);
          });
        }
      }
    };
  }
]);'use strict';
angular.module('directives').directive('hCareExamineButton', [
  'Authentication',
  'lodash',
  function (Authentication, lodash) {
    return {
      restrict: 'E',
      replace: true,
      link: function (scope, el, atts) {
        if (lodash.contains(Authentication.user._role._actions, atts.action)) {
          var buttonText = '<a class=\'btn btn-primary\' ><i class=\'glyphicon glyphicon-eye-open\'></i></a>';
          el.html(buttonText);
          el.on('click', function () {
            scope.$apply(atts.hcareExamineClick);
          });
        }
      }
    };
  }
]);'use strict';
// Configuring the Articles module
angular.module('examinations').run([
  'Menus',
  function (Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', 'Examinations', 'examinations', 'dropdown', '/examinations(/create)?', false, 3);
    Menus.addSubMenuItem('topbar', 'examinations', 'List Examinations', 'examinations', '/examinations', false, 'list_examinations', 0);
    Menus.addSubMenuItem('topbar', 'examinations', 'Search Examinations', 'examinations/search', '/examinations/search', false, 'list_examinations', 1);
  }
]);'use strict';
//Setting up route
angular.module('examinations').config([
  '$stateProvider',
  function ($stateProvider) {
    // Examinations state routing
    $stateProvider.state('listExaminations', {
      url: '/examinations',
      templateUrl: 'modules/examinations/views/list-examinations.client.view.html',
      action: 'list_examinations',
      title: 'Examinations'
    }).state('patientExaminations', {
      url: '/examinations/patient/:patientId',
      templateUrl: 'modules/examinations/views/patient-examinations.client.view.html',
      action: 'list_examinations',
      title: 'Patient Examinations'
    }).state('searchExaminations', {
      url: '/examinations/search',
      templateUrl: 'modules/examinations/views/search-examinations.client.view.html',
      action: 'list_examinations',
      title: 'Search Examinations'
    }).state('createExamination', {
      url: '/examinations/create/:patientId',
      templateUrl: 'modules/examinations/views/create-examination.client.view.html',
      action: 'create_examination',
      title: 'New Examination'
    }).state('viewExamination', {
      url: '/examinations/:examinationId',
      templateUrl: 'modules/examinations/views/view-examination.client.view.html',
      action: 'view_examination',
      title: 'View Examination'
    }).state('viewPatientExamination', {
      url: '/examinations/view/:examinationId',
      templateUrl: 'modules/examinations/views/view-examination.client.view.html',
      action: 'view_examination',
      title: 'View Examination'
    }).state('editPatientExamination', {
      url: '/examinations/edit/:examinationId/edit',
      templateUrl: 'modules/examinations/views/edit-examination.client.view.html',
      action: 'edit_examination',
      title: 'Edit Examinations'
    }).state('editExamination', {
      url: '/examinations/:examinationId/edit',
      templateUrl: 'modules/examinations/views/edit-examination.client.view.html',
      action: 'edit_examination',
      title: 'Edit Examinations'
    });
  }
]);'use strict';
// Examinations controller
angular.module('examinations').controller('ExaminationsController', [
  '$scope',
  '$stateParams',
  '$location',
  'Authentication',
  'Examinations',
  'lodash',
  '$q',
  'Patients',
  'CoreProperties',
  'ActionsHandler',
  'Toolbar',
  'Logger',
  function ($scope, $stateParams, $location, Authentication, Examinations, lodash, $q, Patients, CoreProperties, ActionsHandler, Toolbar, Logger) {
    $scope.authentication = Authentication;
    $scope.tabsConfig = {};
    $scope.tabsConfig.showResuls = false;
    //$scope.examination={};
    /*$scope.examination.colors=null;
         $scope.availableColors=['Red', 'Green', 'Yellow', 'Cool', 'Purple', 'Moove', 'Create', 'Do']*/
    $scope.tagTransform = function (newTag) {
      var item = {
          label: newTag,
          value: newTag.toLowerCase()
        };
      return item;
    };
    $scope.forms = {};
    // $scope.dummy.examinationForm="examinationForm";
    //region schema form
    $scope.form = [
      {
        'type': 'section',
        'htmlClass': 'row',
        'items': [
          {
            'type': 'section',
            'htmlClass': 'col-xs-5 topMargin',
            'items': [{
                key: 'oculusDexter.appearance',
                feedback: '{\'glyphicontop\': true, \'glyphicon\': true, \'glyphicon-ok\': hasSuccess(), \'glyphicon-remove\': hasError()}',
                notitle: true,
                options: {
                  tagging: $scope.tagTransform,
                  taggingLabel: '(new)',
                  taggingTokens: 'ENTER'
                }
              }]
          },
          {
            'type': 'help',
            'helpvalue': '<label class="control-label topMargin ng-binding">Appearance</label>',
            'htmlClass': 'col-xs-2 col-centered'
          },
          {
            'type': 'section',
            'htmlClass': 'col-xs-5 topMargin',
            'items': [{
                key: 'oculusSinister.appearance',
                feedback: '{\'glyphicontop\': true, \'glyphicon\': true, \'glyphicon-ok\': hasSuccess(), \'glyphicon-remove\': hasError()}',
                notitle: true,
                options: {
                  tagging: $scope.tagTransform,
                  taggingLabel: '(new)',
                  taggingTokens: 'ENTER'
                }
              }]
          }
        ]
      },
      {
        'type': 'section',
        'htmlClass': 'row',
        'items': [
          {
            'type': 'section',
            'htmlClass': 'col-xs-5',
            'items': [{
                key: 'oculusDexter.eyeLid',
                feedback: '{\'glyphicontop\': true, \'glyphicon\': true, \'glyphicon-ok\': hasSuccess(), \'glyphicon-remove\': hasError()}',
                notitle: true,
                options: {
                  tagging: $scope.tagTransform,
                  taggingLabel: '(new)',
                  taggingTokens: 'ENTER'
                }
              }]
          },
          {
            'type': 'help',
            'helpvalue': '<label class="control-label ng-binding">Eye Lid</label>',
            'htmlClass': 'col-xs-2 col-centered'
          },
          {
            'type': 'section',
            'htmlClass': 'col-xs-5',
            'items': [{
                key: 'oculusSinister.eyeLid',
                feedback: '{\'glyphicontop\': true, \'glyphicon\': true, \'glyphicon-ok\': hasSuccess(), \'glyphicon-remove\': hasError()}',
                notitle: true,
                options: {
                  tagging: $scope.tagTransform,
                  taggingLabel: '(new)',
                  taggingTokens: 'ENTER'
                }
              }]
          }
        ]
      },
      {
        'type': 'section',
        'htmlClass': 'row',
        'items': [
          {
            'type': 'section',
            'htmlClass': 'col-xs-5',
            'items': [{
                key: 'oculusDexter.lacrimalSystem',
                feedback: '{\'glyphicontop\': true, \'glyphicon\': true, \'glyphicon-ok\': hasSuccess(), \'glyphicon-remove\': hasError()}',
                notitle: true,
                options: {
                  tagging: $scope.tagTransform,
                  taggingLabel: '(new)',
                  taggingTokens: 'ENTER'
                }
              }]
          },
          {
            'type': 'help',
            'helpvalue': '<label class="control-label ng-binding">Lacrimal System</label>',
            'htmlClass': 'col-xs-2 col-centered'
          },
          {
            'type': 'section',
            'htmlClass': 'col-xs-5',
            'items': [{
                key: 'oculusSinister.lacrimalSystem',
                feedback: '{\'glyphicontop\': true, \'glyphicon\': true, \'glyphicon-ok\': hasSuccess(), \'glyphicon-remove\': hasError()}',
                notitle: true,
                options: {
                  tagging: $scope.tagTransform,
                  taggingLabel: '(new)',
                  taggingTokens: 'ENTER'
                }
              }]
          }
        ]
      },
      {
        'type': 'section',
        'htmlClass': 'row',
        'items': [
          {
            'type': 'section',
            'htmlClass': 'col-xs-5',
            'items': [{
                key: 'oculusDexter.conjunctiva',
                feedback: '{\'glyphicontop\': true, \'glyphicon\': true, \'glyphicon-ok\': hasSuccess(), \'glyphicon-remove\': hasError()}',
                notitle: true,
                options: {
                  tagging: $scope.tagTransform,
                  taggingLabel: '(new)',
                  taggingTokens: 'ENTER'
                }
              }]
          },
          {
            'type': 'help',
            'helpvalue': '<label class="control-label ng-binding">Conjunctiva</label>',
            'htmlClass': 'col-xs-2 col-centered'
          },
          {
            'type': 'section',
            'htmlClass': 'col-xs-5',
            'items': [{
                key: 'oculusSinister.conjunctiva',
                feedback: '{\'glyphicontop\': true, \'glyphicon\': true, \'glyphicon-ok\': hasSuccess(), \'glyphicon-remove\': hasError()}',
                notitle: true,
                options: {
                  tagging: $scope.tagTransform,
                  taggingLabel: '(new)',
                  taggingTokens: 'ENTER'
                }
              }]
          }
        ]
      },
      {
        'type': 'section',
        'htmlClass': 'row',
        'items': [
          {
            'type': 'section',
            'htmlClass': 'col-xs-5',
            'items': [{
                key: 'oculusDexter.sclera',
                feedback: '{\'glyphicontop\': true, \'glyphicon\': true, \'glyphicon-ok\': hasSuccess(), \'glyphicon-remove\': hasError()}',
                notitle: true,
                options: {
                  tagging: $scope.tagTransform,
                  taggingLabel: '(new)',
                  taggingTokens: 'ENTER'
                }
              }]
          },
          {
            'type': 'help',
            'helpvalue': '<label class="control-label ng-binding">Sclera</label>',
            'htmlClass': 'col-xs-2 col-centered'
          },
          {
            'type': 'section',
            'htmlClass': 'col-xs-5',
            'items': [{
                key: 'oculusSinister.sclera',
                feedback: '{\'glyphicontop\': true, \'glyphicon\': true, \'glyphicon-ok\': hasSuccess(), \'glyphicon-remove\': hasError()}',
                notitle: true,
                options: {
                  tagging: $scope.tagTransform,
                  taggingLabel: '(new)',
                  taggingTokens: 'ENTER'
                }
              }]
          }
        ]
      },
      {
        'type': 'section',
        'htmlClass': 'row',
        'items': [
          {
            'type': 'section',
            'htmlClass': 'col-xs-5',
            'items': [{
                key: 'oculusDexter.cornea',
                feedback: '{\'glyphicontop\': true, \'glyphicon\': true, \'glyphicon-ok\': hasSuccess(), \'glyphicon-remove\': hasError()}',
                notitle: true,
                options: {
                  tagging: $scope.tagTransform,
                  taggingLabel: '(new)',
                  taggingTokens: 'ENTER'
                }
              }]
          },
          {
            'type': 'help',
            'helpvalue': '<label class="control-label ng-binding">Cornea</label>',
            'htmlClass': 'col-xs-2 col-centered'
          },
          {
            'type': 'section',
            'htmlClass': 'col-xs-5',
            'items': [{
                key: 'oculusSinister.cornea',
                feedback: '{\'glyphicontop\': true, \'glyphicon\': true, \'glyphicon-ok\': hasSuccess(), \'glyphicon-remove\': hasError()}',
                notitle: true,
                options: {
                  tagging: $scope.tagTransform,
                  taggingLabel: '(new)',
                  taggingTokens: 'ENTER'
                }
              }]
          }
        ]
      },
      {
        'type': 'section',
        'htmlClass': 'row',
        'items': [
          {
            'type': 'section',
            'htmlClass': 'col-xs-5',
            'items': [{
                key: 'oculusDexter.anteriorChamber',
                feedback: '{\'glyphicontop\': true, \'glyphicon\': true, \'glyphicon-ok\': hasSuccess(), \'glyphicon-remove\': hasError()}',
                notitle: true,
                options: {
                  tagging: $scope.tagTransform,
                  taggingLabel: '(new)',
                  taggingTokens: 'ENTER'
                }
              }]
          },
          {
            'type': 'help',
            'helpvalue': '<label class="control-label ng-binding">Anterior Chamber</label>',
            'htmlClass': 'col-xs-2 col-centered'
          },
          {
            'type': 'section',
            'htmlClass': 'col-xs-5',
            'items': [{
                key: 'oculusSinister.anteriorChamber',
                feedback: '{\'glyphicontop\': true, \'glyphicon\': true, \'glyphicon-ok\': hasSuccess(), \'glyphicon-remove\': hasError()}',
                notitle: true,
                options: {
                  tagging: $scope.tagTransform,
                  taggingLabel: '(new)',
                  taggingTokens: 'ENTER'
                }
              }]
          }
        ]
      },
      {
        'type': 'section',
        'htmlClass': 'row',
        'items': [
          {
            'type': 'section',
            'htmlClass': 'col-xs-5',
            'items': [{
                key: 'oculusDexter.iris',
                feedback: '{\'glyphicontop\': true, \'glyphicon\': true, \'glyphicon-ok\': hasSuccess(), \'glyphicon-remove\': hasError()}',
                notitle: true,
                options: {
                  tagging: $scope.tagTransform,
                  taggingLabel: '(new)',
                  taggingTokens: 'ENTER'
                }
              }]
          },
          {
            'type': 'help',
            'helpvalue': '<label class="control-label ng-binding">Iris</label>',
            'htmlClass': 'col-xs-2 col-centered'
          },
          {
            'type': 'section',
            'htmlClass': 'col-xs-5',
            'items': [{
                key: 'oculusSinister.iris',
                feedback: '{\'glyphicontop\': true, \'glyphicon\': true, \'glyphicon-ok\': hasSuccess(), \'glyphicon-remove\': hasError()}',
                notitle: true,
                options: {
                  tagging: $scope.tagTransform,
                  taggingLabel: '(new)',
                  taggingTokens: 'ENTER'
                }
              }]
          }
        ]
      },
      {
        'type': 'section',
        'htmlClass': 'row',
        'items': [
          {
            'type': 'section',
            'htmlClass': 'col-xs-5',
            'items': [{
                key: 'oculusDexter.pupil',
                feedback: '{\'glyphicontop\': true, \'glyphicon\': true, \'glyphicon-ok\': hasSuccess(), \'glyphicon-remove\': hasError()}',
                notitle: true,
                options: {
                  tagging: $scope.tagTransform,
                  taggingLabel: '(new)',
                  taggingTokens: 'ENTER'
                }
              }]
          },
          {
            'type': 'help',
            'helpvalue': '<label class="control-label ng-binding">Pupil</label>',
            'htmlClass': 'col-xs-2 col-centered'
          },
          {
            'type': 'section',
            'htmlClass': 'col-xs-5',
            'items': [{
                key: 'oculusSinister.pupil',
                feedback: '{\'glyphicontop\': true, \'glyphicon\': true, \'glyphicon-ok\': hasSuccess(), \'glyphicon-remove\': hasError()}',
                notitle: true,
                options: {
                  tagging: $scope.tagTransform,
                  taggingLabel: '(new)',
                  taggingTokens: 'ENTER'
                }
              }]
          }
        ]
      },
      {
        'type': 'section',
        'htmlClass': 'row',
        'items': [
          {
            'type': 'section',
            'htmlClass': 'col-xs-5',
            'items': [{
                key: 'oculusDexter.lens',
                feedback: '{\'glyphicontop\': true, \'glyphicon\': true, \'glyphicon-ok\': hasSuccess(), \'glyphicon-remove\': hasError()}',
                notitle: true,
                options: {
                  tagging: $scope.tagTransform,
                  taggingLabel: '(new)',
                  taggingTokens: 'ENTER'
                }
              }]
          },
          {
            'type': 'help',
            'helpvalue': '<label class="control-label ng-binding">Lens</label>',
            'htmlClass': 'col-xs-2 col-centered'
          },
          {
            'type': 'section',
            'htmlClass': 'col-xs-5',
            'items': [{
                key: 'oculusSinister.lens',
                feedback: '{\'glyphicontop\': true, \'glyphicon\': true, \'glyphicon-ok\': hasSuccess(), \'glyphicon-remove\': hasError()}',
                notitle: true,
                options: {
                  tagging: $scope.tagTransform,
                  taggingLabel: '(new)',
                  taggingTokens: 'ENTER'
                }
              }]
          }
        ]
      },
      {
        'type': 'section',
        'htmlClass': 'row',
        'items': [
          {
            'type': 'section',
            'htmlClass': 'col-xs-5',
            'items': [{
                key: 'oculusDexter.fundus',
                feedback: '{\'glyphicontop\': true, \'glyphicon\': true, \'glyphicon-ok\': hasSuccess(), \'glyphicon-remove\': hasError()}',
                notitle: true,
                options: {
                  tagging: $scope.tagTransform,
                  taggingLabel: '(new)',
                  taggingTokens: 'ENTER'
                }
              }]
          },
          {
            'type': 'help',
            'helpvalue': '<label class="control-label ng-binding">Fundus</label>',
            'htmlClass': 'col-xs-2 col-centered'
          },
          {
            'type': 'section',
            'htmlClass': 'col-xs-5',
            'items': [{
                key: 'oculusSinister.fundus',
                feedback: '{\'glyphicontop\': true, \'glyphicon\': true, \'glyphicon-ok\': hasSuccess(), \'glyphicon-remove\': hasError()}',
                notitle: true,
                options: {
                  tagging: $scope.tagTransform,
                  taggingLabel: '(new)',
                  taggingTokens: 'ENTER'
                }
              }]
          }
        ]
      },
      {
        'type': 'section',
        'htmlClass': 'row',
        'items': [
          {
            'type': 'section',
            'htmlClass': 'col-xs-5',
            'items': [{
                key: 'oculusDexter.opticNerve',
                feedback: '{\'glyphicontop\': true, \'glyphicon\': true, \'glyphicon-ok\': hasSuccess(), \'glyphicon-remove\': hasError()}',
                notitle: true,
                options: {
                  tagging: $scope.tagTransform,
                  taggingLabel: '(new)',
                  taggingTokens: 'ENTER'
                }
              }]
          },
          {
            'type': 'help',
            'helpvalue': '<label class="control-label ng-binding">Optic Nerve</label>',
            'htmlClass': 'col-xs-2 col-centered'
          },
          {
            'type': 'section',
            'htmlClass': 'col-xs-5',
            'items': [{
                key: 'oculusSinister.opticNerve',
                feedback: '{\'glyphicontop\': true, \'glyphicon\': true, \'glyphicon-ok\': hasSuccess(), \'glyphicon-remove\': hasError()}',
                notitle: true,
                options: {
                  tagging: $scope.tagTransform,
                  taggingLabel: '(new)',
                  taggingTokens: 'ENTER'
                }
              }]
          }
        ]
      },
      {
        'type': 'section',
        'htmlClass': 'row',
        'items': [
          {
            'type': 'section',
            'htmlClass': 'col-xs-5',
            'items': [{
                key: 'oculusDexter.eom',
                feedback: '{\'glyphicontop\': true, \'glyphicon\': true, \'glyphicon-ok\': hasSuccess(), \'glyphicon-remove\': hasError()}',
                notitle: true,
                options: {
                  tagging: $scope.tagTransform,
                  taggingLabel: '(new)',
                  taggingTokens: 'ENTER'
                }
              }]
          },
          {
            'type': 'help',
            'helpvalue': '<label class="control-label ng-binding">EOM</label>',
            'htmlClass': 'col-xs-2 col-centered'
          },
          {
            'type': 'section',
            'htmlClass': 'col-xs-5',
            'items': [{
                key: 'oculusSinister.eom',
                feedback: '{\'glyphicontop\': true, \'glyphicon\': true, \'glyphicon-ok\': hasSuccess(), \'glyphicon-remove\': hasError()}',
                notitle: true,
                options: {
                  tagging: $scope.tagTransform,
                  taggingLabel: '(new)',
                  taggingTokens: 'ENTER'
                }
              }]
          }
        ]
      },
      {
        'type': 'section',
        'htmlClass': 'row',
        'items': [
          {
            'type': 'section',
            'htmlClass': 'col-xs-5',
            'items': [{
                key: 'oculusDexter.va',
                type: 'text',
                notitle: true
              }]
          },
          {
            'type': 'help',
            'helpvalue': '<label class="control-label ng-binding">V/A</label>',
            'htmlClass': 'col-xs-2 col-centered'
          },
          {
            'type': 'section',
            'htmlClass': 'col-xs-5',
            'items': [{
                key: 'oculusSinister.va',
                notitle: true,
                type: 'text'
              }]
          }
        ]
      },
      {
        'type': 'section',
        'htmlClass': 'row',
        'items': [
          {
            'type': 'section',
            'htmlClass': 'col-xs-5',
            'items': [{
                key: 'oculusDexter.bcva',
                type: 'text',
                notitle: true
              }]
          },
          {
            'type': 'help',
            'helpvalue': '<label class="control-label ng-binding">BCVA</label>',
            'htmlClass': 'col-xs-2 col-centered'
          },
          {
            'type': 'section',
            'htmlClass': 'col-xs-5',
            'items': [{
                key: 'oculusSinister.bcva',
                notitle: true,
                type: 'text'
              }]
          }
        ]
      },
      {
        'type': 'section',
        'htmlClass': 'row',
        'items': [
          {
            'type': 'section',
            'htmlClass': 'col-xs-5',
            'items': [{
                key: 'oculusDexter.bcvaWith',
                type: 'text',
                notitle: true
              }]
          },
          {
            'type': 'help',
            'helpvalue': '<label class="control-label ng-binding">BCVA With</label>',
            'htmlClass': 'col-xs-2 col-centered'
          },
          {
            'type': 'section',
            'htmlClass': 'col-xs-5',
            'items': [{
                key: 'oculusSinister.bcvaWith',
                notitle: true,
                type: 'text'
              }]
          }
        ]
      },
      {
        'type': 'section',
        'htmlClass': 'row',
        'items': [
          {
            'type': 'section',
            'htmlClass': 'col-xs-5',
            'items': [{
                key: 'oculusDexter.iop',
                type: 'text',
                notitle: true
              }]
          },
          {
            'type': 'help',
            'helpvalue': '<label class="control-label ng-binding">IOP</label>',
            'htmlClass': 'col-xs-2 col-centered'
          },
          {
            'type': 'section',
            'htmlClass': 'col-xs-5',
            'items': [{
                key: 'oculusSinister.iop',
                notitle: true,
                type: 'text'
              }]
          }
        ]
      },
      {
        'key': 'comment',
        'type': 'textarea',
        'placeholder': 'Make a comment'
      }
    ];
    $scope.schema = {
      'type': 'object',
      'title': 'Examination',
      'properties': {
        'oculusDexter': {
          'type': 'object',
          'properties': {
            'appearance': {
              'title': 'Appearance',
              'type': 'array',
              format: 'uiselect',
              placeholder: 'Normal',
              items: [{
                  value: 'test',
                  label: 'Test'
                }]
            },
            'eyeLid': {
              'title': 'Eye Lid',
              'type': 'array',
              format: 'uiselect',
              placeholder: 'No Abnormality Detected',
              items: [
                {
                  value: 'rl',
                  label: 'RL'
                },
                {
                  value: 'entropion',
                  label: 'Entropion'
                },
                {
                  value: 'ectropion',
                  label: 'Ectropion'
                },
                {
                  value: 'eistichiasis',
                  label: 'Distichiasis'
                },
                {
                  value: 'ptosis',
                  label: 'Ptosis'
                },
                {
                  value: 'chalazion',
                  label: 'Chalazion'
                },
                {
                  value: 'stye',
                  label: 'Stye'
                },
                {
                  value: 'blepharitis',
                  label: 'Blepharitis'
                },
                {
                  value: 'mass',
                  label: 'Mass'
                },
                {
                  value: 'madarosis',
                  label: 'Madarosis'
                },
                {
                  value: 'epicanthaus',
                  label: 'Epicanthaus'
                },
                {
                  value: 'blepharochalasis',
                  label: 'Blepharochalasis'
                },
                {
                  value: 'dermatochalasis',
                  label: 'Dermatochalasis'
                },
                {
                  value: 'oedema',
                  label: 'Oedema'
                }
              ]
            },
            'lacrimalSystem': {
              'title': 'Lacrimal System',
              'type': 'array',
              format: 'uiselect',
              placeholder: 'Normal',
              items: [{
                  value: 'test',
                  label: 'Test'
                }]
            },
            'conjunctiva': {
              'title': 'Conjunctiva',
              'type': 'array',
              format: 'uiselect',
              placeholder: 'Normal',
              items: [
                {
                  value: 'active-trachoma',
                  label: 'Active trachoma'
                },
                {
                  value: 't-iii',
                  label: 'T III'
                },
                {
                  value: 'mpc',
                  label: 'MPC'
                },
                {
                  value: 'pc',
                  label: 'PC'
                },
                {
                  value: 'allergy',
                  label: 'Allergy'
                },
                {
                  value: 'vernal-keratoconjunctivitis',
                  label: 'Vernal keratoconjunctivitis'
                },
                {
                  value: 'ptrygeum',
                  label: 'Ptrygeum'
                },
                {
                  value: 'ptds',
                  label: 'PTDs'
                }
              ]
            },
            'sclera': {
              'title': 'Sclera',
              'type': 'array',
              format: 'uiselect',
              placeholder: 'Normal',
              items: [
                {
                  value: 'nodular-episcleritis',
                  label: 'Nodular Episcleritis'
                },
                {
                  value: 'diffuse-episcleritis',
                  label: 'Diffuse Episcleritis'
                },
                {
                  value: 'scleritis',
                  label: 'Scleritis'
                }
              ]
            },
            'cornea': {
              'title': 'Cornea',
              'type': 'array',
              format: 'uiselect',
              placeholder: 'Ps, Clear Centre',
              items: [
                {
                  value: 'scar-of-previous-op.',
                  label: 'Scar of previous op.'
                },
                {
                  value: 'ps',
                  label: 'Ps'
                },
                {
                  value: 'nebula',
                  label: 'Nebula'
                },
                {
                  value: 'corneal-ulcer',
                  label: 'Corneal Ulcer'
                },
                {
                  value: 'leukoma-adherent',
                  label: 'Leukoma adherent'
                },
                {
                  value: 'leukoma-non-adherent',
                  label: 'Leukoma non-adherent'
                },
                {
                  value: 'keratitis',
                  label: 'Keratitis'
                },
                {
                  value: 'keratoconus',
                  label: 'Keratoconus'
                },
                {
                  value: 'arcus-senilis',
                  label: 'Arcus senilis'
                },
                {
                  value: 'degeneration',
                  label: 'Degeneration'
                },
                {
                  value: 'stromal-dystophy',
                  label: 'Stromal Dystophy'
                },
                {
                  value: 'endothelial-dystophy',
                  label: 'Endothelial Dystophy'
                },
                {
                  value: 'epithelial-oedema',
                  label: 'Epithelial Oedema'
                },
                {
                  value: 'stromal oedema',
                  label: 'Stromal Oedema'
                },
                {
                  value: 'striated-keratopathy',
                  label: 'Striated Keratopathy'
                }
              ]
            },
            'anteriorChamber': {
              'title': 'Anterior Chamber',
              'type': 'array',
              format: 'uiselect',
              placeholder: 'Normal Depth No Abnormal Content',
              items: [
                {
                  value: 'cells',
                  label: 'Cells'
                },
                {
                  value: 'flare',
                  label: 'Flare'
                },
                {
                  value: 'level-hyphema',
                  label: 'level Hyphema'
                },
                {
                  value: 'diffuse-hyphema',
                  label: 'Diffuse Hyphema'
                },
                {
                  value: 'inflammatory-membrane',
                  label: 'Inflammatory membrane'
                },
                {
                  value: 'hypopion',
                  label: 'Hypopion'
                }
              ]
            },
            'iris': {
              'title': 'Iris',
              'type': 'array',
              format: 'uiselect',
              placeholder: 'Normal Color And Pattern',
              items: [{
                  value: 'test',
                  label: 'Test'
                }]
            },
            'pupil': {
              'title': 'Pupil',
              'type': 'array',
              format: 'uiselect',
              placeholder: 'R R R Direct and Cons.',
              items: [{
                  value: 'test',
                  label: 'Test'
                }]
            },
            'lens': {
              'title': 'Lens',
              'type': 'array',
              format: 'uiselect',
              placeholder: 'Clear In Place',
              items: [
                {
                  value: 'imsc',
                  label: 'IMSC'
                },
                {
                  value: 'nuclear-cataract',
                  label: 'Nuclear cataract'
                },
                {
                  value: 'complicated-cataract',
                  label: 'Complicated cataract'
                },
                {
                  value: 'subluxated',
                  label: 'Subluxated'
                },
                {
                  value: 'pseudoexfoliation',
                  label: 'Pseudoexfoliation'
                },
                {
                  value: 'microspherophakia',
                  label: 'Microspherophakia'
                }
              ]
            },
            'fundus': {
              'title': 'Fundus',
              'type': 'array',
              format: 'uiselect',
              placeholder: 'Normal',
              items: [
                {
                  value: 'tessellated',
                  label: 'Tessellated'
                },
                {
                  value: 'myopic',
                  label: 'Myopic'
                },
                {
                  value: 'mild-npdr',
                  label: 'Mild NPDR'
                },
                {
                  value: 'sever npdr',
                  label: 'Sever NPDR'
                },
                {
                  value: 'pdr',
                  label: 'PDR'
                },
                {
                  value: 'macular-oedema',
                  label: 'Macular Oedema'
                },
                {
                  value: 'drusen',
                  label: 'Drusen'
                },
                {
                  value: 'amd',
                  label: 'AMD'
                },
                {
                  value: 'vein-occlusion',
                  label: 'Vein occlusion'
                },
                {
                  value: 'artery-occlusion',
                  label: 'Artery occlusion'
                }
              ]
            },
            'opticNerve': {
              'title': 'Optic Nerve',
              'type': 'array',
              format: 'uiselect',
              placeholder: 'Normal',
              items: [
                {
                  value: 'pale',
                  label: 'Pale'
                },
                {
                  value: 'atrophy',
                  label: 'Atrophy'
                },
                {
                  value: 'increased-cd-ratio',
                  label: 'Increased C/D ratio'
                },
                {
                  value: 'cupping',
                  label: 'Cupping'
                },
                {
                  value: 'papilloedema',
                  label: 'Papilloedema'
                },
                {
                  value: 'tilted',
                  label: 'Tilted'
                }
              ]
            },
            'va': {
              'title': 'V/A',
              'type': 'string'
            },
            'eom': {
              'title': 'EOM',
              'type': 'array',
              format: 'uiselect',
              placeholder: 'Free Balanced Ocular Motility In The Sex Cardinal Directions',
              items: [{
                  value: 'test',
                  label: 'Test'
                }]
            },
            'bcva': {
              'title': 'BCVA',
              'type': 'string'
            },
            'bcvaWith': {
              'title': 'BCVA With',
              'type': 'string'
            },
            'iop': {
              'title': 'IOP',
              'type': 'string'
            }
          }
        },
        'oculusSinister': {
          'type': 'object',
          'properties': {
            'appearance': {
              'title': 'Appearance',
              'type': 'array',
              format: 'uiselect',
              placeholder: 'Normal',
              items: [{
                  value: 'test',
                  label: 'Test'
                }]
            },
            'eyeLid': {
              'title': 'Eye Lid',
              'type': 'array',
              format: 'uiselect',
              placeholder: 'No Abnormality Detected',
              items: [
                {
                  value: 'rl',
                  label: 'RL'
                },
                {
                  value: 'entropion',
                  label: 'Entropion'
                },
                {
                  value: 'ectropion',
                  label: 'Ectropion'
                },
                {
                  value: 'eistichiasis',
                  label: 'Distichiasis'
                },
                {
                  value: 'ptosis',
                  label: 'Ptosis'
                },
                {
                  value: 'chalazion',
                  label: 'Chalazion'
                },
                {
                  value: 'stye',
                  label: 'Stye'
                },
                {
                  value: 'blepharitis',
                  label: 'Blepharitis'
                },
                {
                  value: 'mass',
                  label: 'Mass'
                },
                {
                  value: 'madarosis',
                  label: 'Madarosis'
                },
                {
                  value: 'epicanthaus',
                  label: 'Epicanthaus'
                },
                {
                  value: 'blepharochalasis',
                  label: 'Blepharochalasis'
                },
                {
                  value: 'dermatochalasis',
                  label: 'Dermatochalasis'
                },
                {
                  value: 'oedema',
                  label: 'Oedema'
                }
              ]
            },
            'lacrimalSystem': {
              'title': 'Lacrimal System',
              'type': 'array',
              format: 'uiselect',
              placeholder: 'Normal',
              items: [{
                  value: 'test',
                  label: 'Test'
                }]
            },
            'conjunctiva': {
              'title': 'Conjunctiva',
              'type': 'array',
              format: 'uiselect',
              placeholder: 'Normal',
              items: [
                {
                  value: 'active-trachoma',
                  label: 'Active trachoma'
                },
                {
                  value: 't-iii',
                  label: 'T III'
                },
                {
                  value: 'mpc',
                  label: 'MPC'
                },
                {
                  value: 'pc',
                  label: 'PC'
                },
                {
                  value: 'allergy',
                  label: 'Allergy'
                },
                {
                  value: 'vernal-keratoconjunctivitis',
                  label: 'Vernal keratoconjunctivitis'
                },
                {
                  value: 'ptrygeum',
                  label: 'Ptrygeum'
                },
                {
                  value: 'ptds',
                  label: 'PTDs'
                }
              ]
            },
            'sclera': {
              'title': 'Sclera',
              'type': 'array',
              format: 'uiselect',
              placeholder: 'Normal',
              items: [
                {
                  value: 'nodular-episcleritis',
                  label: 'Nodular Episcleritis'
                },
                {
                  value: 'diffuse-episcleritis',
                  label: 'Diffuse Episcleritis'
                },
                {
                  value: 'scleritis',
                  label: 'Scleritis'
                }
              ]
            },
            'cornea': {
              'title': 'Cornea',
              'type': 'array',
              format: 'uiselect',
              placeholder: 'Ps, Clear Centre',
              items: [
                {
                  value: 'scar-of-previous-op.',
                  label: 'Scar of previous op.'
                },
                {
                  value: 'ps',
                  label: 'Ps'
                },
                {
                  value: 'nebula',
                  label: 'Nebula'
                },
                {
                  value: 'corneal-ulcer',
                  label: 'Corneal Ulcer'
                },
                {
                  value: 'leukoma-adherent',
                  label: 'Leukoma adherent'
                },
                {
                  value: 'leukoma-non-adherent',
                  label: 'Leukoma non-adherent'
                },
                {
                  value: 'keratitis',
                  label: 'Keratitis'
                },
                {
                  value: 'keratoconus',
                  label: 'Keratoconus'
                },
                {
                  value: 'arcus-senilis',
                  label: 'Arcus senilis'
                },
                {
                  value: 'degeneration',
                  label: 'Degeneration'
                },
                {
                  value: 'stromal-dystophy',
                  label: 'Stromal Dystophy'
                },
                {
                  value: 'endothelial-dystophy',
                  label: 'Endothelial Dystophy'
                },
                {
                  value: 'epithelial-oedema',
                  label: 'Epithelial Oedema'
                },
                {
                  value: 'stromal oedema',
                  label: 'Stromal Oedema'
                },
                {
                  value: 'striated-keratopathy',
                  label: 'Striated Keratopathy'
                }
              ]
            },
            'anteriorChamber': {
              'title': 'Anterior Chamber',
              'type': 'array',
              format: 'uiselect',
              placeholder: 'Normal Depth No Abnormal Content',
              items: [
                {
                  value: 'cells',
                  label: 'Cells'
                },
                {
                  value: 'flare',
                  label: 'Flare'
                },
                {
                  value: 'level-hyphema',
                  label: 'level Hyphema'
                },
                {
                  value: 'diffuse-hyphema',
                  label: 'Diffuse Hyphema'
                },
                {
                  value: 'inflammatory-membrane',
                  label: 'Inflammatory membrane'
                },
                {
                  value: 'hypopion',
                  label: 'Hypopion'
                }
              ]
            },
            'iris': {
              'title': 'Iris',
              'type': 'array',
              format: 'uiselect',
              placeholder: 'Normal Color And Pattern',
              items: [{
                  value: 'test',
                  label: 'Test'
                }]
            },
            'pupil': {
              'title': 'Pupil',
              'type': 'array',
              format: 'uiselect',
              placeholder: 'R R R Direct and Cons.',
              items: [{
                  value: 'test',
                  label: 'Test'
                }]
            },
            'lens': {
              'title': 'Lens',
              'type': 'array',
              format: 'uiselect',
              placeholder: 'Clear In Place',
              items: [
                {
                  value: 'imsc',
                  label: 'IMSC'
                },
                {
                  value: 'nuclear-cataract',
                  label: 'Nuclear cataract'
                },
                {
                  value: 'complicated-cataract',
                  label: 'Complicated cataract'
                },
                {
                  value: 'subluxated',
                  label: 'Subluxated'
                },
                {
                  value: 'pseudoexfoliation',
                  label: 'Pseudoexfoliation'
                },
                {
                  value: 'microspherophakia',
                  label: 'Microspherophakia'
                }
              ]
            },
            'fundus': {
              'title': 'Fundus',
              'type': 'array',
              format: 'uiselect',
              placeholder: 'Normal',
              items: [
                {
                  value: 'tessellated',
                  label: 'Tessellated'
                },
                {
                  value: 'myopic',
                  label: 'Myopic'
                },
                {
                  value: 'mild-npdr',
                  label: 'Mild NPDR'
                },
                {
                  value: 'sever npdr',
                  label: 'Sever NPDR'
                },
                {
                  value: 'pdr',
                  label: 'PDR'
                },
                {
                  value: 'macular-oedema',
                  label: 'Macular Oedema'
                },
                {
                  value: 'drusen',
                  label: 'Drusen'
                },
                {
                  value: 'amd',
                  label: 'AMD'
                },
                {
                  value: 'vein-occlusion',
                  label: 'Vein occlusion'
                },
                {
                  value: 'artery-occlusion',
                  label: 'Artery occlusion'
                }
              ]
            },
            'opticNerve': {
              'title': 'Optic Nerve',
              'type': 'array',
              format: 'uiselect',
              placeholder: 'Normal',
              items: [
                {
                  value: 'pale',
                  label: 'Pale'
                },
                {
                  value: 'atrophy',
                  label: 'Atrophy'
                },
                {
                  value: 'increased-cd-ratio',
                  label: 'Increased C/D ratio'
                },
                {
                  value: 'cupping',
                  label: 'Cupping'
                },
                {
                  value: 'papilloedema',
                  label: 'Papilloedema'
                },
                {
                  value: 'tilted',
                  label: 'Tilted'
                }
              ]
            },
            'eom': {
              'title': 'EOM',
              'type': 'array',
              format: 'uiselect',
              placeholder: 'Free Balanced Ocular Motility In The Sex Cardinal Directions',
              items: [{
                  value: 'test',
                  label: 'Test'
                }]
            },
            'va': {
              'title': 'V/A',
              'type': 'string'
            },
            'bcva': {
              'title': 'BCVA',
              'type': 'string'
            },
            'bcvaWith': {
              'title': 'BCVA With',
              'type': 'string'
            },
            'iop': {
              'title': 'IOP',
              'type': 'string'
            }
          }
        },
        'comment': {
          'title': 'Comment',
          'type': 'string'
        }
      }
    };
    $scope.viewSchema = {
      'type': 'object',
      'title': 'Examination',
      'properties': {
        'oculusDexter': {
          'type': 'object',
          'properties': {
            'appearance': {
              'title': 'Appearance',
              'type': 'array',
              format: 'uiselect',
              placeholder: 'Normal'
            },
            'eyeLid': {
              'title': 'Eye Lid',
              'type': 'array',
              format: 'uiselect',
              placeholder: 'No Abnormality Detected',
              items: [
                {
                  value: 'rl',
                  label: 'RL'
                },
                {
                  value: 'entropion',
                  label: 'Entropion'
                },
                {
                  value: 'ectropion',
                  label: 'Ectropion'
                },
                {
                  value: 'eistichiasis',
                  label: 'Distichiasis'
                },
                {
                  value: 'ptosis',
                  label: 'Ptosis'
                },
                {
                  value: 'chalazion',
                  label: 'Chalazion'
                },
                {
                  value: 'stye',
                  label: 'Stye'
                },
                {
                  value: 'blepharitis',
                  label: 'Blepharitis'
                },
                {
                  value: 'mass',
                  label: 'Mass'
                },
                {
                  value: 'madarosis',
                  label: 'Madarosis'
                },
                {
                  value: 'epicanthaus',
                  label: 'Epicanthaus'
                },
                {
                  value: 'blepharochalasis',
                  label: 'Blepharochalasis'
                },
                {
                  value: 'dermatochalasis',
                  label: 'Dermatochalasis'
                },
                {
                  value: 'oedema',
                  label: 'Oedema'
                }
              ]
            },
            'lacrimalSystem': {
              'title': 'Lacrimal System',
              'type': 'array',
              format: 'uiselect',
              placeholder: 'Normal'
            },
            'conjunctiva': {
              'title': 'Conjunctiva',
              'type': 'array',
              format: 'uiselect',
              placeholder: 'Normal',
              items: [
                {
                  value: 'active-trachoma',
                  label: 'Active trachoma'
                },
                {
                  value: 't-iii',
                  label: 'T III'
                },
                {
                  value: 'mpc',
                  label: 'MPC'
                },
                {
                  value: 'pc',
                  label: 'PC'
                },
                {
                  value: 'allergy',
                  label: 'Allergy'
                },
                {
                  value: 'vernal-keratoconjunctivitis',
                  label: 'Vernal keratoconjunctivitis'
                },
                {
                  value: 'ptrygeum',
                  label: 'Ptrygeum'
                },
                {
                  value: 'ptds',
                  label: 'PTDs'
                }
              ]
            },
            'sclera': {
              'title': 'Sclera',
              'type': 'array',
              format: 'uiselect',
              placeholder: 'Normal',
              items: [
                {
                  value: 'nodular-episcleritis',
                  label: 'Nodular Episcleritis'
                },
                {
                  value: 'diffuse-episcleritis',
                  label: 'Diffuse Episcleritis'
                },
                {
                  value: 'scleritis',
                  label: 'Scleritis'
                }
              ]
            },
            'cornea': {
              'title': 'Cornea',
              'type': 'array',
              format: 'uiselect',
              placeholder: 'Ps, Clear Centre',
              items: [
                {
                  value: 'scar-of-previous-op.',
                  label: 'Scar of previous op.'
                },
                {
                  value: 'ps',
                  label: 'Ps'
                },
                {
                  value: 'nebula',
                  label: 'Nebula'
                },
                {
                  value: 'corneal-ulcer',
                  label: 'Corneal Ulcer'
                },
                {
                  value: 'leukoma-adherent',
                  label: 'Leukoma adherent'
                },
                {
                  value: 'leukoma-non-adherent',
                  label: 'Leukoma non-adherent'
                },
                {
                  value: 'keratitis',
                  label: 'Keratitis'
                },
                {
                  value: 'keratoconus',
                  label: 'Keratoconus'
                },
                {
                  value: 'arcus-senilis',
                  label: 'Arcus senilis'
                },
                {
                  value: 'degeneration',
                  label: 'Degeneration'
                },
                {
                  value: 'stromal-dystophy',
                  label: 'Stromal Dystophy'
                },
                {
                  value: 'endothelial-dystophy',
                  label: 'Endothelial Dystophy'
                },
                {
                  value: 'epithelial-oedema',
                  label: 'Epithelial Oedema'
                },
                {
                  value: 'stromal oedema',
                  label: 'Stromal Oedema'
                },
                {
                  value: 'striated-keratopathy',
                  label: 'Striated Keratopathy'
                }
              ]
            },
            'anteriorChamber': {
              'title': 'Anterior Chamber',
              'type': 'array',
              format: 'uiselect',
              placeholder: 'Normal Depth No Abnormal Content',
              items: [
                {
                  value: 'cells',
                  label: 'Cells'
                },
                {
                  value: 'flare',
                  label: 'Flare'
                },
                {
                  value: 'level-hyphema',
                  label: 'level Hyphema'
                },
                {
                  value: 'diffuse-hyphema',
                  label: 'Diffuse Hyphema'
                },
                {
                  value: 'inflammatory-membrane',
                  label: 'Inflammatory membrane'
                },
                {
                  value: 'hypopion',
                  label: 'Hypopion'
                }
              ]
            },
            'iris': {
              'title': 'Iris',
              'type': 'array',
              format: 'uiselect',
              placeholder: 'Normal Color And Pattern'
            },
            'pupil': {
              'title': 'Pupil',
              'type': 'array',
              format: 'uiselect',
              placeholder: 'R R R Direct and Cons.'
            },
            'lens': {
              'title': 'Lens',
              'type': 'array',
              format: 'uiselect',
              placeholder: 'Clear In Place',
              items: [
                {
                  value: 'imsc',
                  label: 'IMSC'
                },
                {
                  value: 'nuclear-cataract',
                  label: 'Nuclear cataract'
                },
                {
                  value: 'complicated-cataract',
                  label: 'Complicated cataract'
                },
                {
                  value: 'subluxated',
                  label: 'Subluxated'
                },
                {
                  value: 'pseudoexfoliation',
                  label: 'Pseudoexfoliation'
                },
                {
                  value: 'microspherophakia',
                  label: 'Microspherophakia'
                }
              ]
            },
            'fundus': {
              'title': 'Fundus',
              'type': 'array',
              format: 'uiselect',
              placeholder: 'Normal',
              items: [
                {
                  value: 'tessellated',
                  label: 'Tessellated'
                },
                {
                  value: 'myopic',
                  label: 'Myopic'
                },
                {
                  value: 'mild-npdr',
                  label: 'Mild NPDR'
                },
                {
                  value: 'sever npdr',
                  label: 'Sever NPDR'
                },
                {
                  value: 'pdr',
                  label: 'PDR'
                },
                {
                  value: 'macular-oedema',
                  label: 'Macular Oedema'
                },
                {
                  value: 'drusen',
                  label: 'Drusen'
                },
                {
                  value: 'amd',
                  label: 'AMD'
                },
                {
                  value: 'vein-occlusion',
                  label: 'Vein occlusion'
                },
                {
                  value: 'artery-occlusion',
                  label: 'Artery occlusion'
                }
              ]
            },
            'opticNerve': {
              'title': 'Optic Nerve',
              'type': 'array',
              format: 'uiselect',
              placeholder: 'Normal',
              items: [
                {
                  value: 'pale',
                  label: 'Pale'
                },
                {
                  value: 'atrophy',
                  label: 'Atrophy'
                },
                {
                  value: 'increased-cd-ratio',
                  label: 'Increased C/D ratio'
                },
                {
                  value: 'cupping',
                  label: 'Cupping'
                },
                {
                  value: 'papilloedema',
                  label: 'Papilloedema'
                },
                {
                  value: 'tilted',
                  label: 'Tilted'
                }
              ]
            },
            'va': {
              'title': 'V/A',
              'type': 'string'
            },
            'eom': {
              'title': 'EOM',
              'type': 'array',
              format: 'uiselect',
              placeholder: 'Free Balanced Ocular Motility In The Sex Cardinal Directions'
            },
            'bcva': {
              'title': 'BCVA',
              'type': 'string'
            },
            'bcvaWith': {
              'title': 'BCVA With',
              'type': 'string'
            },
            'iop': {
              'title': 'IOP',
              'type': 'string'
            }
          }
        },
        'oculusSinister': {
          'type': 'object',
          'properties': {
            'appearance': {
              'title': 'Appearance',
              'type': 'array',
              format: 'uiselect',
              placeholder: 'Normal'
            },
            'eyeLid': {
              'title': 'Eye Lid',
              'type': 'array',
              format: 'uiselect',
              placeholder: 'No Abnormality Detected',
              items: [
                {
                  value: 'rl',
                  label: 'RL'
                },
                {
                  value: 'entropion',
                  label: 'Entropion'
                },
                {
                  value: 'ectropion',
                  label: 'Ectropion'
                },
                {
                  value: 'eistichiasis',
                  label: 'Distichiasis'
                },
                {
                  value: 'ptosis',
                  label: 'Ptosis'
                },
                {
                  value: 'chalazion',
                  label: 'Chalazion'
                },
                {
                  value: 'stye',
                  label: 'Stye'
                },
                {
                  value: 'blepharitis',
                  label: 'Blepharitis'
                },
                {
                  value: 'mass',
                  label: 'Mass'
                },
                {
                  value: 'madarosis',
                  label: 'Madarosis'
                },
                {
                  value: 'epicanthaus',
                  label: 'Epicanthaus'
                },
                {
                  value: 'blepharochalasis',
                  label: 'Blepharochalasis'
                },
                {
                  value: 'dermatochalasis',
                  label: 'Dermatochalasis'
                },
                {
                  value: 'oedema',
                  label: 'Oedema'
                }
              ]
            },
            'lacrimalSystem': {
              'title': 'Lacrimal System',
              'type': 'array',
              format: 'uiselect',
              placeholder: 'Normal'
            },
            'conjunctiva': {
              'title': 'Conjunctiva',
              'type': 'array',
              format: 'uiselect',
              placeholder: 'Normal',
              items: [
                {
                  value: 'active-trachoma',
                  label: 'Active trachoma'
                },
                {
                  value: 't-iii',
                  label: 'T III'
                },
                {
                  value: 'mpc',
                  label: 'MPC'
                },
                {
                  value: 'pc',
                  label: 'PC'
                },
                {
                  value: 'allergy',
                  label: 'Allergy'
                },
                {
                  value: 'vernal-keratoconjunctivitis',
                  label: 'Vernal keratoconjunctivitis'
                },
                {
                  value: 'ptrygeum',
                  label: 'Ptrygeum'
                },
                {
                  value: 'ptds',
                  label: 'PTDs'
                }
              ]
            },
            'sclera': {
              'title': 'Sclera',
              'type': 'array',
              format: 'uiselect',
              placeholder: 'Normal',
              items: [
                {
                  value: 'nodular-episcleritis',
                  label: 'Nodular Episcleritis'
                },
                {
                  value: 'diffuse-episcleritis',
                  label: 'Diffuse Episcleritis'
                },
                {
                  value: 'scleritis',
                  label: 'Scleritis'
                }
              ]
            },
            'cornea': {
              'title': 'Cornea',
              'type': 'array',
              format: 'uiselect',
              placeholder: 'Ps, Clear Centre',
              items: [
                {
                  value: 'scar-of-previous-op.',
                  label: 'Scar of previous op.'
                },
                {
                  value: 'ps',
                  label: 'Ps'
                },
                {
                  value: 'nebula',
                  label: 'Nebula'
                },
                {
                  value: 'corneal-ulcer',
                  label: 'Corneal Ulcer'
                },
                {
                  value: 'leukoma-adherent',
                  label: 'Leukoma adherent'
                },
                {
                  value: 'leukoma-non-adherent',
                  label: 'Leukoma non-adherent'
                },
                {
                  value: 'keratitis',
                  label: 'Keratitis'
                },
                {
                  value: 'keratoconus',
                  label: 'Keratoconus'
                },
                {
                  value: 'arcus-senilis',
                  label: 'Arcus senilis'
                },
                {
                  value: 'degeneration',
                  label: 'Degeneration'
                },
                {
                  value: 'stromal-dystophy',
                  label: 'Stromal Dystophy'
                },
                {
                  value: 'endothelial-dystophy',
                  label: 'Endothelial Dystophy'
                },
                {
                  value: 'epithelial-oedema',
                  label: 'Epithelial Oedema'
                },
                {
                  value: 'stromal oedema',
                  label: 'Stromal Oedema'
                },
                {
                  value: 'striated-keratopathy',
                  label: 'Striated Keratopathy'
                }
              ]
            },
            'anteriorChamber': {
              'title': 'Anterior Chamber',
              'type': 'array',
              format: 'uiselect',
              placeholder: 'Normal Depth No Abnormal Content',
              items: [
                {
                  value: 'cells',
                  label: 'Cells'
                },
                {
                  value: 'flare',
                  label: 'Flare'
                },
                {
                  value: 'level-hyphema',
                  label: 'level Hyphema'
                },
                {
                  value: 'diffuse-hyphema',
                  label: 'Diffuse Hyphema'
                },
                {
                  value: 'inflammatory-membrane',
                  label: 'Inflammatory membrane'
                },
                {
                  value: 'hypopion',
                  label: 'Hypopion'
                }
              ]
            },
            'iris': {
              'title': 'Iris',
              'type': 'array',
              format: 'uiselect',
              placeholder: 'Normal Color And Pattern'
            },
            'pupil': {
              'title': 'Pupil',
              'type': 'array',
              format: 'uiselect',
              placeholder: 'R R R Direct and Cons.'
            },
            'lens': {
              'title': 'Lens',
              'type': 'array',
              format: 'uiselect',
              placeholder: 'Clear In Place',
              items: [
                {
                  value: 'imsc',
                  label: 'IMSC'
                },
                {
                  value: 'nuclear-cataract',
                  label: 'Nuclear cataract'
                },
                {
                  value: 'complicated-cataract',
                  label: 'Complicated cataract'
                },
                {
                  value: 'subluxated',
                  label: 'Subluxated'
                },
                {
                  value: 'pseudoexfoliation',
                  label: 'Pseudoexfoliation'
                },
                {
                  value: 'microspherophakia',
                  label: 'Microspherophakia'
                }
              ]
            },
            'fundus': {
              'title': 'Fundus',
              'type': 'array',
              format: 'uiselect',
              placeholder: 'Normal',
              items: [
                {
                  value: 'tessellated',
                  label: 'Tessellated'
                },
                {
                  value: 'myopic',
                  label: 'Myopic'
                },
                {
                  value: 'mild-npdr',
                  label: 'Mild NPDR'
                },
                {
                  value: 'sever npdr',
                  label: 'Sever NPDR'
                },
                {
                  value: 'pdr',
                  label: 'PDR'
                },
                {
                  value: 'macular-oedema',
                  label: 'Macular Oedema'
                },
                {
                  value: 'drusen',
                  label: 'Drusen'
                },
                {
                  value: 'amd',
                  label: 'AMD'
                },
                {
                  value: 'vein-occlusion',
                  label: 'Vein occlusion'
                },
                {
                  value: 'artery-occlusion',
                  label: 'Artery occlusion'
                }
              ]
            },
            'opticNerve': {
              'title': 'Optic Nerve',
              'type': 'array',
              format: 'uiselect',
              placeholder: 'Normal',
              items: [
                {
                  value: 'pale',
                  label: 'Pale'
                },
                {
                  value: 'atrophy',
                  label: 'Atrophy'
                },
                {
                  value: 'increased-cd-ratio',
                  label: 'Increased C/D ratio'
                },
                {
                  value: 'cupping',
                  label: 'Cupping'
                },
                {
                  value: 'papilloedema',
                  label: 'Papilloedema'
                },
                {
                  value: 'tilted',
                  label: 'Tilted'
                }
              ]
            },
            'eom': {
              'title': 'EOM',
              'type': 'array',
              format: 'uiselect',
              placeholder: 'Free Balanced Ocular Motility In The Sex Cardinal Directions'
            },
            'va': {
              'title': 'V/A',
              'type': 'string'
            },
            'bcva': {
              'title': 'BCVA',
              'type': 'string'
            },
            'bcvaWith': {
              'title': 'BCVA With',
              'type': 'string'
            },
            'iop': {
              'title': 'IOP',
              'type': 'string'
            }
          }
        },
        'comment': {
          'title': 'Comment',
          'type': 'string'
        }
      },
      'readonly': true
    };
    $scope.viewForm = [
      {
        'type': 'section',
        'htmlClass': 'row',
        'items': [
          {
            'type': 'section',
            'htmlClass': 'col-xs-5 topMargin',
            'items': [{
                key: 'oculusDexter.appearance',
                feedback: '{\'glyphicontop\': true, \'glyphicon\': true, \'glyphicon-ok\': hasSuccess(), \'glyphicon-remove\': hasError()}',
                notitle: true,
                options: {
                  tagging: $scope.tagTransform,
                  taggingLabel: '(new)',
                  taggingTokens: 'ENTER'
                },
                readonly: true
              }]
          },
          {
            'type': 'help',
            'helpvalue': '<label class="control-label topMargin ng-binding">Appearance</label>',
            'htmlClass': 'col-xs-2 col-centered'
          },
          {
            'type': 'section',
            'htmlClass': 'col-xs-5 topMargin',
            'items': [{
                key: 'oculusSinister.appearance',
                feedback: '{\'glyphicontop\': true, \'glyphicon\': true, \'glyphicon-ok\': hasSuccess(), \'glyphicon-remove\': hasError()}',
                notitle: true,
                options: {
                  tagging: $scope.tagTransform,
                  taggingLabel: '(new)',
                  taggingTokens: 'ENTER'
                },
                readonly: true
              }]
          }
        ]
      },
      {
        'type': 'section',
        'htmlClass': 'row',
        'items': [
          {
            'type': 'section',
            'htmlClass': 'col-xs-5',
            'items': [{
                key: 'oculusDexter.eyeLid',
                feedback: '{\'glyphicontop\': true, \'glyphicon\': true, \'glyphicon-ok\': hasSuccess(), \'glyphicon-remove\': hasError()}',
                notitle: true,
                options: {
                  tagging: $scope.tagTransform,
                  taggingLabel: '(new)',
                  taggingTokens: 'ENTER'
                },
                readonly: true
              }]
          },
          {
            'type': 'help',
            'helpvalue': '<label class="control-label ng-binding">Eye Lid</label>',
            'htmlClass': 'col-xs-2 col-centered'
          },
          {
            'type': 'section',
            'htmlClass': 'col-xs-5',
            'items': [{
                key: 'oculusSinister.eyeLid',
                feedback: '{\'glyphicontop\': true, \'glyphicon\': true, \'glyphicon-ok\': hasSuccess(), \'glyphicon-remove\': hasError()}',
                notitle: true,
                options: {
                  tagging: $scope.tagTransform,
                  taggingLabel: '(new)',
                  taggingTokens: 'ENTER'
                },
                readonly: true
              }]
          }
        ]
      },
      {
        'type': 'section',
        'htmlClass': 'row',
        'items': [
          {
            'type': 'section',
            'htmlClass': 'col-xs-5',
            'items': [{
                key: 'oculusDexter.lacrimalSystem',
                feedback: '{\'glyphicontop\': true, \'glyphicon\': true, \'glyphicon-ok\': hasSuccess(), \'glyphicon-remove\': hasError()}',
                notitle: true,
                options: {
                  tagging: $scope.tagTransform,
                  taggingLabel: '(new)',
                  taggingTokens: 'ENTER'
                }
              }]
          },
          {
            'type': 'help',
            'helpvalue': '<label class="control-label ng-binding">Lacrimal System</label>',
            'htmlClass': 'col-xs-2 col-centered'
          },
          {
            'type': 'section',
            'htmlClass': 'col-xs-5',
            'items': [{
                key: 'oculusSinister.lacrimalSystem',
                feedback: '{\'glyphicontop\': true, \'glyphicon\': true, \'glyphicon-ok\': hasSuccess(), \'glyphicon-remove\': hasError()}',
                notitle: true,
                options: {
                  tagging: $scope.tagTransform,
                  taggingLabel: '(new)',
                  taggingTokens: 'ENTER'
                }
              }]
          }
        ]
      },
      {
        'type': 'section',
        'htmlClass': 'row',
        'items': [
          {
            'type': 'section',
            'htmlClass': 'col-xs-5',
            'items': [{
                key: 'oculusDexter.conjunctiva',
                feedback: '{\'glyphicontop\': true, \'glyphicon\': true, \'glyphicon-ok\': hasSuccess(), \'glyphicon-remove\': hasError()}',
                notitle: true,
                options: {
                  tagging: $scope.tagTransform,
                  taggingLabel: '(new)',
                  taggingTokens: 'ENTER'
                }
              }]
          },
          {
            'type': 'help',
            'helpvalue': '<label class="control-label ng-binding">Conjunctiva</label>',
            'htmlClass': 'col-xs-2 col-centered'
          },
          {
            'type': 'section',
            'htmlClass': 'col-xs-5',
            'items': [{
                key: 'oculusSinister.conjunctiva',
                feedback: '{\'glyphicontop\': true, \'glyphicon\': true, \'glyphicon-ok\': hasSuccess(), \'glyphicon-remove\': hasError()}',
                notitle: true,
                options: {
                  tagging: $scope.tagTransform,
                  taggingLabel: '(new)',
                  taggingTokens: 'ENTER'
                }
              }]
          }
        ]
      },
      {
        'type': 'section',
        'htmlClass': 'row',
        'items': [
          {
            'type': 'section',
            'htmlClass': 'col-xs-5',
            'items': [{
                key: 'oculusDexter.sclera',
                feedback: '{\'glyphicontop\': true, \'glyphicon\': true, \'glyphicon-ok\': hasSuccess(), \'glyphicon-remove\': hasError()}',
                notitle: true,
                options: {
                  tagging: $scope.tagTransform,
                  taggingLabel: '(new)',
                  taggingTokens: 'ENTER'
                }
              }]
          },
          {
            'type': 'help',
            'helpvalue': '<label class="control-label ng-binding">Sclera</label>',
            'htmlClass': 'col-xs-2 col-centered'
          },
          {
            'type': 'section',
            'htmlClass': 'col-xs-5',
            'items': [{
                key: 'oculusSinister.sclera',
                feedback: '{\'glyphicontop\': true, \'glyphicon\': true, \'glyphicon-ok\': hasSuccess(), \'glyphicon-remove\': hasError()}',
                notitle: true,
                options: {
                  tagging: $scope.tagTransform,
                  taggingLabel: '(new)',
                  taggingTokens: 'ENTER'
                }
              }]
          }
        ]
      },
      {
        'type': 'section',
        'htmlClass': 'row',
        'items': [
          {
            'type': 'section',
            'htmlClass': 'col-xs-5',
            'items': [{
                key: 'oculusDexter.cornea',
                feedback: '{\'glyphicontop\': true, \'glyphicon\': true, \'glyphicon-ok\': hasSuccess(), \'glyphicon-remove\': hasError()}',
                notitle: true,
                options: {
                  tagging: $scope.tagTransform,
                  taggingLabel: '(new)',
                  taggingTokens: 'ENTER'
                }
              }]
          },
          {
            'type': 'help',
            'helpvalue': '<label class="control-label ng-binding">Cornea</label>',
            'htmlClass': 'col-xs-2 col-centered'
          },
          {
            'type': 'section',
            'htmlClass': 'col-xs-5',
            'items': [{
                key: 'oculusSinister.cornea',
                feedback: '{\'glyphicontop\': true, \'glyphicon\': true, \'glyphicon-ok\': hasSuccess(), \'glyphicon-remove\': hasError()}',
                notitle: true,
                options: {
                  tagging: $scope.tagTransform,
                  taggingLabel: '(new)',
                  taggingTokens: 'ENTER'
                }
              }]
          }
        ]
      },
      {
        'type': 'section',
        'htmlClass': 'row',
        'items': [
          {
            'type': 'section',
            'htmlClass': 'col-xs-5',
            'items': [{
                key: 'oculusDexter.anteriorChamber',
                feedback: '{\'glyphicontop\': true, \'glyphicon\': true, \'glyphicon-ok\': hasSuccess(), \'glyphicon-remove\': hasError()}',
                notitle: true,
                options: {
                  tagging: $scope.tagTransform,
                  taggingLabel: '(new)',
                  taggingTokens: 'ENTER'
                }
              }]
          },
          {
            'type': 'help',
            'helpvalue': '<label class="control-label ng-binding">Anterior Chamber</label>',
            'htmlClass': 'col-xs-2 col-centered'
          },
          {
            'type': 'section',
            'htmlClass': 'col-xs-5',
            'items': [{
                key: 'oculusSinister.anteriorChamber',
                feedback: '{\'glyphicontop\': true, \'glyphicon\': true, \'glyphicon-ok\': hasSuccess(), \'glyphicon-remove\': hasError()}',
                notitle: true,
                options: {
                  tagging: $scope.tagTransform,
                  taggingLabel: '(new)',
                  taggingTokens: 'ENTER'
                }
              }]
          }
        ]
      },
      {
        'type': 'section',
        'htmlClass': 'row',
        'items': [
          {
            'type': 'section',
            'htmlClass': 'col-xs-5',
            'items': [{
                key: 'oculusDexter.iris',
                feedback: '{\'glyphicontop\': true, \'glyphicon\': true, \'glyphicon-ok\': hasSuccess(), \'glyphicon-remove\': hasError()}',
                notitle: true,
                options: {
                  tagging: $scope.tagTransform,
                  taggingLabel: '(new)',
                  taggingTokens: 'ENTER'
                }
              }]
          },
          {
            'type': 'help',
            'helpvalue': '<label class="control-label ng-binding">Iris</label>',
            'htmlClass': 'col-xs-2 col-centered'
          },
          {
            'type': 'section',
            'htmlClass': 'col-xs-5',
            'items': [{
                key: 'oculusSinister.iris',
                feedback: '{\'glyphicontop\': true, \'glyphicon\': true, \'glyphicon-ok\': hasSuccess(), \'glyphicon-remove\': hasError()}',
                notitle: true,
                options: {
                  tagging: $scope.tagTransform,
                  taggingLabel: '(new)',
                  taggingTokens: 'ENTER'
                }
              }]
          }
        ]
      },
      {
        'type': 'section',
        'htmlClass': 'row',
        'items': [
          {
            'type': 'section',
            'htmlClass': 'col-xs-5',
            'items': [{
                key: 'oculusDexter.pupil',
                feedback: '{\'glyphicontop\': true, \'glyphicon\': true, \'glyphicon-ok\': hasSuccess(), \'glyphicon-remove\': hasError()}',
                notitle: true,
                options: {
                  tagging: $scope.tagTransform,
                  taggingLabel: '(new)',
                  taggingTokens: 'ENTER'
                }
              }]
          },
          {
            'type': 'help',
            'helpvalue': '<label class="control-label ng-binding">Pupil</label>',
            'htmlClass': 'col-xs-2 col-centered'
          },
          {
            'type': 'section',
            'htmlClass': 'col-xs-5',
            'items': [{
                key: 'oculusSinister.pupil',
                feedback: '{\'glyphicontop\': true, \'glyphicon\': true, \'glyphicon-ok\': hasSuccess(), \'glyphicon-remove\': hasError()}',
                notitle: true,
                options: {
                  tagging: $scope.tagTransform,
                  taggingLabel: '(new)',
                  taggingTokens: 'ENTER'
                }
              }]
          }
        ]
      },
      {
        'type': 'section',
        'htmlClass': 'row',
        'items': [
          {
            'type': 'section',
            'htmlClass': 'col-xs-5',
            'items': [{
                key: 'oculusDexter.lens',
                feedback: '{\'glyphicontop\': true, \'glyphicon\': true, \'glyphicon-ok\': hasSuccess(), \'glyphicon-remove\': hasError()}',
                notitle: true,
                options: {
                  tagging: $scope.tagTransform,
                  taggingLabel: '(new)',
                  taggingTokens: 'ENTER'
                }
              }]
          },
          {
            'type': 'help',
            'helpvalue': '<label class="control-label ng-binding">Lens</label>',
            'htmlClass': 'col-xs-2 col-centered'
          },
          {
            'type': 'section',
            'htmlClass': 'col-xs-5',
            'items': [{
                key: 'oculusSinister.lens',
                feedback: '{\'glyphicontop\': true, \'glyphicon\': true, \'glyphicon-ok\': hasSuccess(), \'glyphicon-remove\': hasError()}',
                notitle: true,
                options: {
                  tagging: $scope.tagTransform,
                  taggingLabel: '(new)',
                  taggingTokens: 'ENTER'
                }
              }]
          }
        ]
      },
      {
        'type': 'section',
        'htmlClass': 'row',
        'items': [
          {
            'type': 'section',
            'htmlClass': 'col-xs-5',
            'items': [{
                key: 'oculusDexter.fundus',
                feedback: '{\'glyphicontop\': true, \'glyphicon\': true, \'glyphicon-ok\': hasSuccess(), \'glyphicon-remove\': hasError()}',
                notitle: true,
                options: {
                  tagging: $scope.tagTransform,
                  taggingLabel: '(new)',
                  taggingTokens: 'ENTER'
                }
              }]
          },
          {
            'type': 'help',
            'helpvalue': '<label class="control-label ng-binding">Fundus</label>',
            'htmlClass': 'col-xs-2 col-centered'
          },
          {
            'type': 'section',
            'htmlClass': 'col-xs-5',
            'items': [{
                key: 'oculusSinister.fundus',
                feedback: '{\'glyphicontop\': true, \'glyphicon\': true, \'glyphicon-ok\': hasSuccess(), \'glyphicon-remove\': hasError()}',
                notitle: true,
                options: {
                  tagging: $scope.tagTransform,
                  taggingLabel: '(new)',
                  taggingTokens: 'ENTER'
                }
              }]
          }
        ]
      },
      {
        'type': 'section',
        'htmlClass': 'row',
        'items': [
          {
            'type': 'section',
            'htmlClass': 'col-xs-5',
            'items': [{
                key: 'oculusDexter.opticNerve',
                feedback: '{\'glyphicontop\': true, \'glyphicon\': true, \'glyphicon-ok\': hasSuccess(), \'glyphicon-remove\': hasError()}',
                notitle: true,
                options: {
                  tagging: $scope.tagTransform,
                  taggingLabel: '(new)',
                  taggingTokens: 'ENTER'
                }
              }]
          },
          {
            'type': 'help',
            'helpvalue': '<label class="control-label ng-binding">Optic Nerve</label>',
            'htmlClass': 'col-xs-2 col-centered'
          },
          {
            'type': 'section',
            'htmlClass': 'col-xs-5',
            'items': [{
                key: 'oculusSinister.opticNerve',
                feedback: '{\'glyphicontop\': true, \'glyphicon\': true, \'glyphicon-ok\': hasSuccess(), \'glyphicon-remove\': hasError()}',
                notitle: true,
                options: {
                  tagging: $scope.tagTransform,
                  taggingLabel: '(new)',
                  taggingTokens: 'ENTER'
                }
              }]
          }
        ]
      },
      {
        'type': 'section',
        'htmlClass': 'row',
        'items': [
          {
            'type': 'section',
            'htmlClass': 'col-xs-5',
            'items': [{
                key: 'oculusDexter.eom',
                feedback: '{\'glyphicontop\': true, \'glyphicon\': true, \'glyphicon-ok\': hasSuccess(), \'glyphicon-remove\': hasError()}',
                notitle: true,
                options: {
                  tagging: $scope.tagTransform,
                  taggingLabel: '(new)',
                  taggingTokens: 'ENTER'
                }
              }]
          },
          {
            'type': 'help',
            'helpvalue': '<label class="control-label ng-binding">EOM</label>',
            'htmlClass': 'col-xs-2 col-centered'
          },
          {
            'type': 'section',
            'htmlClass': 'col-xs-5',
            'items': [{
                key: 'oculusSinister.eom',
                feedback: '{\'glyphicontop\': true, \'glyphicon\': true, \'glyphicon-ok\': hasSuccess(), \'glyphicon-remove\': hasError()}',
                notitle: true,
                options: {
                  tagging: $scope.tagTransform,
                  taggingLabel: '(new)',
                  taggingTokens: 'ENTER'
                }
              }]
          }
        ]
      },
      {
        'type': 'section',
        'htmlClass': 'row',
        'items': [
          {
            'type': 'section',
            'htmlClass': 'col-xs-5',
            'items': [{
                key: 'oculusDexter.va',
                type: 'text',
                notitle: true
              }],
            readonly: true
          },
          {
            'type': 'help',
            'helpvalue': '<label class="control-label ng-binding">V/A</label>',
            'htmlClass': 'col-xs-2 col-centered'
          },
          {
            'type': 'section',
            'htmlClass': 'col-xs-5',
            'items': [{
                key: 'oculusSinister.va',
                notitle: true,
                type: 'text'
              }],
            readonly: true
          }
        ]
      },
      {
        'type': 'section',
        'htmlClass': 'row',
        'items': [
          {
            'type': 'section',
            'htmlClass': 'col-xs-5',
            'items': [{
                key: 'oculusDexter.bcva',
                type: 'text',
                notitle: true
              }]
          },
          {
            'type': 'help',
            'helpvalue': '<label class="control-label ng-binding">BCVA</label>',
            'htmlClass': 'col-xs-2 col-centered'
          },
          {
            'type': 'section',
            'htmlClass': 'col-xs-5',
            'items': [{
                key: 'oculusSinister.bcva',
                notitle: true,
                type: 'text'
              }]
          }
        ]
      },
      {
        'type': 'section',
        'htmlClass': 'row',
        'items': [
          {
            'type': 'section',
            'htmlClass': 'col-xs-5',
            'items': [{
                key: 'oculusDexter.bcvaWith',
                type: 'text',
                notitle: true
              }]
          },
          {
            'type': 'help',
            'helpvalue': '<label class="control-label ng-binding">BCVA With</label>',
            'htmlClass': 'col-xs-2 col-centered'
          },
          {
            'type': 'section',
            'htmlClass': 'col-xs-5',
            'items': [{
                key: 'oculusSinister.bcvaWith',
                notitle: true,
                type: 'text'
              }]
          }
        ]
      },
      {
        'type': 'section',
        'htmlClass': 'row',
        'items': [
          {
            'type': 'section',
            'htmlClass': 'col-xs-5',
            'items': [{
                key: 'oculusDexter.iop',
                type: 'text',
                notitle: true
              }]
          },
          {
            'type': 'help',
            'helpvalue': '<label class="control-label ng-binding">IOP</label>',
            'htmlClass': 'col-xs-2 col-centered'
          },
          {
            'type': 'section',
            'htmlClass': 'col-xs-5',
            'items': [{
                key: 'oculusSinister.iop',
                notitle: true,
                type: 'text'
              }]
          }
        ]
      },
      {
        'key': 'comment',
        'type': 'textarea',
        'placeholder': 'Make a comment'
      }
    ];
    $scope.onSubmit = function (form) {
      // First we broadcast an event so all fields validate themselves
      $scope.$broadcast('schemaFormValidate');
      // Then we check if the form is valid
      if (form.$valid) {
        //console.log($scope.examination);
        $scope.create();
      }
    };
    //endregion schema form
    // Create new Examination
    $scope.create = function () {
      // Create new Examination object
      var examination = new Examinations($scope.examination);
      // Redirect after save
      examination.$save(function (response) {
        $location.path('/examinations/patient/' + examination._patient);
        Logger.success('Examination created successfully', true);
        // Clear form fields
        $scope.examination = {};
      }, function (errorResponse) {
        Logger.error(errorResponse.data.message, true);  //$scope.error = errorResponse.data.message;
      });
    };
    // Remove existing Examination
    $scope.remove = function (examination) {
      if (examination) {
        // ?????????????
        examination.$remove();
        for (var i in $scope.examinations) {
          if ($scope.examinations[i] === examination) {
            $scope.examinations.splice(i, 1);
          }
        }
      } else {
        $scope.examination.$remove(function () {
          //console.log($scope.examination._patient);
          if ($location.url().indexOf('/examinations/view/') > -1) {
            //console.log($scope.examination._patient);
            $location.path('examinations/patient/' + $scope.examination._patient._id);
            Logger.success('Examination deleted successfully', true);
          } else {
            $location.path('examinations');
          }
        });
      }
    };
    // Update existing Examination
    $scope.update = function () {
      var examination = $scope.examination;
      //console.log(examination._patient);
      examination.$update(function () {
        if ($location.url().indexOf('/examinations/edit') > -1) {
          $location.path('examinations/view/' + examination._id);
        } else {
          $location.path('examinations/' + examination._id);
        }
        ///log success message
        Logger.success('Examination updated successfully', true);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    // Find a list of Examinations
    $scope.find = function () {
      $scope._patient = null;
      Examinations.query(function (res) {
        $scope.examinations = res.list;
      });
    };
    // Find existing Examination
    $scope.findOne = function (callback) {
      Examinations.get({ examinationId: $stateParams.examinationId }, function (_examination) {
        $scope.examination = _examination;
        $scope.$broadcast('schemaFormRedraw');
        if (callback) {
          callback();
        }
      });
    };
    // findPatientExaminations
    $scope.findPatientExaminations = function (callback) {
      $scope._patient = $stateParams.patientId;
      $scope.initOne();
      $scope.examination._patient = $stateParams.patientId;
      Patients.get({ patientId: $stateParams.patientId }, function (patient) {
        if (patient) {
          CoreProperties.setPageSubTitle(patient.fullName);
          $scope.paginationConfig = {};
          $scope.paginationConfig.pageSize = 10;
          $scope.paginationConfig.currentPage = 1;
          $scope.paginationConfig.totalItems = 0;
          $scope.paginationConfig.maxSize = 2;
          $scope.paginationConfig.numPages = 1;
          $scope.paginationConfig.pageSizeOptions = [
            10,
            50,
            100
          ];
          $scope.paginationConfig.showPagination = false;
          $scope.fireSearch();
        }
      });
    };
    /*
         // findPatientExaminations
         $scope.findPatientExaminations = function (callback) {
         $scope._patient = $stateParams.patientId;
         $scope.initOne();
         $scope.examination._patient =  $stateParams.patientId;
         Patients.get({
         patientId: $stateParams.patientId
         }, function (patient) {
         if (patient) {
         CoreProperties.setPageSubTitle(patient.fullName);
         var examination = new Examinations($scope.examination);
         Examinations.query(examination, function (_examinations) {
         $scope.examinations = _examinations.list;
         if(callback){
         callback();
         }
         });
         }
         });
         };
         */
    // Search existing Examinations
    $scope.search = function (callback) {
      $scope.examination.paginationConfig = {};
      $scope.examination.paginationConfig.pageNo = $scope.paginationConfig.currentPage;
      $scope.examination.paginationConfig.pageSize = $scope.paginationConfig.pageSize;
      //var examination = new Examinations($scope.examination);
      Examinations.query($scope.examination, function (_examinations) {
        $scope.examinations = _examinations.list;
        if (callback) {
          callback(_examinations.count);
        }
      });
    };
    $scope.initOne = function () {
      $scope.examination = new Examinations({});
    };
    $scope.initCreate = function () {
      $scope.initOne();
      Patients.get({ patientId: $stateParams.patientId }, function (patient) {
        if (patient) {
          $scope.examination._patient = patient._id;
          CoreProperties.setPageSubTitle(patient.fullName);
          Toolbar.addToolbarCommand('clearExamination', 'create_examination', 'Clear', 'refresh', 0);
          Toolbar.addToolbarCommand('saveExamination', 'create_examination', 'Save', 'floppy-save', 1);
        }
      });
    };
    $scope.initEdit = function () {
      $scope.findOne(function () {
        CoreProperties.setPageSubTitle($scope.examination._patient.fullName + ' ' + $scope.examination.created.time);
        Toolbar.addToolbarCommand('updateExamination', 'edit_examination', 'Save', 'floppy-save', 0);
      });
    };
    $scope.initView = function () {
      $scope.schema.readonly = true;
      $scope.findOne(function () {
        CoreProperties.setPageSubTitle($scope.examination._patient.fullName + ' ' + $scope.examination.created.time);
        Toolbar.addToolbarCommand('editExamination', 'edit_examination', 'Edit', 'edit', 1);
        Toolbar.addToolbarCommand('deleteExamination', 'delete_examination', 'Delete', 'trash', 2, null, 'Are you sure to delete examination ?');
      });
    };
    $scope.initSearch = function () {
      $scope.initOne();
      //$scope.tabsConfig = {};
      //$scope.tabsConfig.showResuls = false;
      $scope.paginationConfig = {};
      $scope.paginationConfig.pageSize = 10;
      $scope.paginationConfig.currentPage = 1;
      $scope.paginationConfig.totalItems = 0;
      $scope.paginationConfig.maxSize = 2;
      $scope.paginationConfig.numPages = 1;
      $scope.paginationConfig.pageSizeOptions = [
        10,
        50,
        100
      ];
      $scope.paginationConfig.showPagination = false;
      Toolbar.addToolbarCommand('searchExaminations', 'list_examinations', 'Search', 'search', 0);
    };
    $scope.isPageSizeOptionEnabled = function (_option) {
      var optionIndex = $scope.paginationConfig.pageSizeOptions.indexOf(_option);
      if (optionIndex == 0) {
        return true;
      }
      return $scope.paginationConfig.pageSizeOptions[optionIndex - 1] < $scope.paginationConfig.totalItems;
    };
    $scope.isPageSizeOptionSelecetd = function (_option) {
      return $scope.paginationConfig.pageSize == _option;
    };
    $scope.selectPageSizeOption = function (_option) {
      if ($scope.isPageSizeOptionEnabled(_option)) {
        $scope.paginationConfig.pageSize = _option;
        $scope.fireSearch();
      }
    };
    $scope.pageChanged = function () {
      //console.log($scope.paginationConfig.currentPage);
      $scope.fireSearch();
    };
    $scope.getShowPagination = function () {
      //console.log($scope.paginationConfig.totalItems);
      return $scope.paginationConfig.totalItems > 0;
    };
    $scope.getNumOfPages = function () {
      return $scope.paginationConfig.totalItems / $scope.paginationConfig.maxSize;
    };
    $scope.fireSearch = function () {
      $scope.search(function (_count) {
        $scope.tabsConfig.showResults = true;
        $scope.paginationConfig.totalItems = _count;
        $scope.paginationConfig.showPagination = $scope.getShowPagination();
        $scope.paginationConfig.numPages = $scope.getNumOfPages();
      });
    };
    $scope.initList = function () {
      $scope.initOne();
      //$scope.tabsConfig = {};
      //$scope.tabsConfig.showResuls = false;
      $scope.paginationConfig = {};
      $scope.paginationConfig.pageSize = 10;
      $scope.paginationConfig.currentPage = 1;
      $scope.paginationConfig.totalItems = 0;
      $scope.paginationConfig.maxSize = 2;
      $scope.paginationConfig.numPages = 1;
      $scope.paginationConfig.pageSizeOptions = [
        10,
        50,
        100
      ];
      $scope.paginationConfig.showPagination = false;
      $scope.fireSearch();
    };
    ActionsHandler.onActionFired('saveExamination', $scope, function (action, args) {
      $scope.onSubmit($scope.forms.examinationForm);
    });
    ActionsHandler.onActionFired('updateExamination', $scope, function (action, args) {
      $scope.update();
    });
    ActionsHandler.onActionFired('searchExaminations', $scope, function (action, args) {
      $scope.fireSearch();
    });
    ActionsHandler.onActionFired('editExamination', $scope, function (action, args) {
      if ($location.url().indexOf('/examinations/view/') > -1) {
        $location.path('examinations/edit/' + $scope.examination._id + '/edit');
      } else {
        $location.path('examinations/' + $scope.examination._id + '/edit');
      }
    });
    ActionsHandler.onActionFired('deleteExamination', $scope, function (action, args) {
      $scope.remove();
    });
  }
]);'use strict';
//Examinations service used to communicate Examinations REST endpoints
angular.module('examinations').factory('Examinations', [
  '$resource',
  function ($resource) {
    return $resource('examinations/:examinationId', { examinationId: '@_id' }, {
      update: { method: 'PUT' },
      query: { isArray: false }
    });
  }
]);'use strict';
// Configuring the Articles module
angular.module('manage-users').run([
  'Menus',
  function (Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', 'Users', 'manage-users', 'dropdown', '/manage-users(/create)?', false, 1);
    Menus.addSubMenuItem('topbar', 'manage-users', 'List users', 'manage-users', '/manage-users', false, 'list_users', 0);
    Menus.addSubMenuItem('topbar', 'manage-users', 'New user', 'manage-users/create', '/manage-users/create', false, 'create_user', 1);
    Menus.addSubMenuItem('topbar', 'manage-users', 'Search users', 'manage-users/search', '/manage-users/search', false, 'list_users', 2);
  }
]);'use strict';
//Setting up route
angular.module('manage-users').config([
  '$stateProvider',
  function ($stateProvider) {
    // Manage users state routing
    $stateProvider.state('listManageUsers', {
      url: '/manage-users',
      templateUrl: 'modules/manage-users/views/list-manage-users.client.view.html',
      action: 'list_users',
      title: 'Users'
    }).state('createManageUser', {
      url: '/manage-users/create',
      templateUrl: 'modules/manage-users/views/create-manage-user.client.view.html',
      action: 'create_user',
      title: 'New user'
    }).state('searchManageUser', {
      url: '/manage-users/search',
      templateUrl: 'modules/manage-users/views/search-manage-users.client.view.html',
      action: 'list_users',
      title: 'Search Users'
    }).state('viewManageUser', {
      url: '/manage-users/:manageUserId',
      templateUrl: 'modules/manage-users/views/view-manage-user.client.view.html',
      action: 'view_user',
      title: 'View User'
    }).state('editManageUser', {
      url: '/manage-users/:manageUserId/edit',
      templateUrl: 'modules/manage-users/views/edit-manage-user.client.view.html',
      action: 'edit_user',
      title: 'Edit User'
    });
  }
]);'use strict';
// Manage users controller
angular.module('manage-users').controller('ManageUsersController', [
  '$scope',
  '$stateParams',
  '$location',
  'ManageUsers',
  'Roles',
  'Logger',
  'ActionsHandler',
  'Toolbar',
  function ($scope, $stateParams, $location, ManageUsers, Roles, Logger, ActionsHandler, Toolbar) {
    $scope.initRoles = function (callback) {
      $scope.rolesObj = {};
      $scope.rolesObj.selected_role = null;
      $scope.rolesObj.selected_roles = [];
      Roles.query(function (_roles) {
        $scope.rolesObj.roles = _roles;
        if (callback) {
          callback();
        }
      });
    };
    //select Role
    $scope.toggleRoleSelection = function (role_id) {
      $scope.manageUser._role = role_id;
    };
    // Init New Managed User
    $scope.initOne = function () {
      $scope.initRoles(function () {
        $scope.manageUser = new ManageUsers({ password: Math.random().toString(36).slice(-8) });
      });
    };
    // Create new Managed User
    $scope.create = function () {
      // Create new Managed user object
      var manageUser = $scope.manageUser;
      // Redirect after save
      manageUser.$save(function (response) {
        $location.path('manage-users/' + response._id);
        ///log success message
        Logger.success('User created successfully', true);
        // Clear form fields
        $scope.initOne();
      }, function (errorResponse) {
        ///log error message
        Logger.error(errorResponse.data.message, true);  //$scope.error = errorResponse.data.message;
      });
    };
    // Remove existing Managed user
    $scope.remove = function (manageUser) {
      if (manageUser) {
        manageUser.$remove(function () {
          for (var i in $scope.manageUsers) {
            if ($scope.manageUsers[i] === manageUser) {
              $scope.manageUsers.splice(i, 1);
            }
          }
          ///log success message
          Logger.success('User deleted successfully', true);
        }, function (errorResponse) {
          ///log error message
          Logger.error(errorResponse.data.message, true);
        });
      } else {
        $scope.manageUser.$remove(function () {
          $location.path('manage-users');
          ///log success message
          Logger.success('User deleted successfully', true);
        }, function (errorResponse) {
          ///log error message
          Logger.error(errorResponse.data.message, true);
        });
      }
    };
    // Update existing Managed User
    $scope.update = function () {
      var manageUser = $scope.manageUser;
      manageUser.$update(function () {
        $location.path('manage-users/' + manageUser._id);
        ///log success message
        Logger.success('User updated successfully', true);
      }, function (errorResponse) {
        ///log error message
        Logger.error(errorResponse.data.message, true);  //$scope.error = errorResponse.data.message;
      });
    };
    // Find a list of Managed users
    $scope.find = function () {
      $scope.manageUsers = ManageUsers.query();
    };
    // Find existing Manage user
    $scope.findOne = function (callback) {
      $scope.initRoles(function () {
        ManageUsers.get({ manageUserId: $stateParams.manageUserId }, function (_user) {
          $scope.manageUser = _user;
          if (_user._role) {
            $scope.rolesObj.selected_roles.push(_user._role);
          }
          if (callback) {
            callback();
          }
        });
      });
    };
    // Search existing Users
    $scope.search = function (callback) {
      if ((!$scope.manageUser.fullName || $scope.manageUser.fullName == '' || $scope.manageUser.fullName == undefined) && (!$scope.manageUser.displayName || $scope.manageUser.displayName == '' || $scope.manageUser.displayName == undefined) && (!$scope.manageUser.email || $scope.manageUser.email == '' || $scope.manageUser.email == undefined) && (!$scope.manageUser._role || $scope.manageUser._role == '' || $scope.manageUser._role == undefined)) {
        Logger.error('Please Enter Search Criteria', true);
        $scope.manageUsers = [];
      } else {
        ManageUsers.query($scope.manageUser, function (_users) {
          $scope.manageUsers = _users;
          if (callback) {
            callback();
          }
        });
      }
    };
    $scope.$watch('rolesObj.selected_role', function (value) {
      if ($scope.manageUser) {
        if (value) {
          $scope.manageUser._role = value._id;
        } else {
          $scope.manageUser._role = value;  // null
        }
      }
    }, true);
    $scope.initCreate = function () {
      $scope.initOne();
      Toolbar.addToolbarCommand('saveUser', 'create_user', 'Save', 'floppy-save', 0);
    };
    $scope.initEdit = function () {
      $scope.initRoles(function () {
        $scope.findOne(function () {
          Toolbar.addToolbarCommand('updateUser', 'edit_user', 'Save', 'floppy-save', 0);
        });
      });
    };
    $scope.initView = function () {
      $scope.findOne(function () {
        Toolbar.addToolbarCommand('editUser', 'edit_user', 'Edit', 'edit', 1);
        Toolbar.addToolbarCommand('deleteUser', 'delete_user', 'Delete', 'trash', 2, null, 'Are you sure to delete user "' + $scope.manageUser.email + '"?');
      });
    };
    $scope.initSearch = function () {
      $scope.initOne();
      $scope.tabsConfig = {};
      $scope.tabsConfig.showResuls = false;
      Toolbar.addToolbarCommand('searchUser', 'list_users', 'Search', 'search', 0);
    };
    ActionsHandler.onActionFired('saveUser', $scope, function (action, args) {
      $scope.create();
    });
    ActionsHandler.onActionFired('updateUser', $scope, function (action, args) {
      $scope.update();
    });
    ActionsHandler.onActionFired('editUser', $scope, function (action, args) {
      $location.path('manage-users/' + $scope.manageUser._id + '/edit');
    });
    ActionsHandler.onActionFired('deleteUser', $scope, function (action, args) {
      $scope.remove();
    });
    ActionsHandler.onActionFired('searchUser', $scope, function (action, args) {
      $scope.search(function () {
        $scope.tabsConfig.showResults = true;
      });
    });
  }
]);'use strict';
//Manage users service used to communicate Manage users REST endpoints
angular.module('manage-users').factory('ManageUsers', [
  '$resource',
  function ($resource) {
    return $resource('manage-users/:manageUserId', { manageUserId: '@_id' }, { update: { method: 'PUT' } });
  }
]);'use strict';
angular.module('module').factory('Module', [
  '$resource',
  function ($resource) {
    // Module service logic
    // ...
    // Public API
    return $resource('module/list');
  }
]);'use strict';
// Configuring the Articles module
angular.module('patients').run([
  'Menus',
  function (Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', 'Patients', 'patients', 'dropdown', '/patients(/create)?', false, 2);
    Menus.addSubMenuItem('topbar', 'patients', 'List Patients', 'patients', '/patients', false, 'list_patients', 0);
    Menus.addSubMenuItem('topbar', 'patients', 'New Patient', 'patients/create', '/patients/create', false, 'create_patient', 1);
    Menus.addSubMenuItem('topbar', 'patients', 'Search Patient', 'patients/search', '/patients/search', false, 'list_patients', 2);
  }
]);'use strict';
//Setting up route
angular.module('patients').config([
  '$stateProvider',
  function ($stateProvider) {
    // Patients state routing
    $stateProvider.state('listPatients', {
      url: '/patients',
      templateUrl: 'modules/patients/views/list-patients.client.view.html',
      action: 'list_patients',
      title: 'Patients'
    }).state('createPatient', {
      url: '/patients/create',
      templateUrl: 'modules/patients/views/create-patient.client.view.html',
      action: 'create_patient',
      title: 'New Patient'
    }).state('searchPatients', {
      url: '/patients/search',
      templateUrl: 'modules/patients/views/search-patients.client.view.html',
      action: 'list_patients',
      title: 'Search Patients'
    }).state('viewPatient', {
      url: '/patients/:patientId',
      templateUrl: 'modules/patients/views/view-patient.client.view.html',
      action: 'view_patient',
      title: 'View Patient'
    }).state('editPatient', {
      url: '/patients/:patientId/edit',
      templateUrl: 'modules/patients/views/edit-patient.client.view.html',
      action: 'edit_patient',
      title: 'Edit Patient'
    });
  }
]);'use strict';
// Patients controller
angular.module('patients').controller('PatientsController', [
  '$scope',
  '$stateParams',
  '$location',
  'Patients',
  'CoreProperties',
  'Logger',
  'lodash',
  'moment',
  '$modal',
  '$upload',
  'ActionsHandler',
  'Toolbar',
  function ($scope, $stateParams, $location, Patients, CoreProperties, Logger, lodash, Moment, $modal, $upload, ActionsHandler, Toolbar) {
    $scope.configObj = {};
    $scope.configObj._ = lodash;
    $scope.configObj.Moment = Moment;
    $scope.configObj.genders = [
      {
        _id: 'male',
        name: 'Male'
      },
      {
        _id: 'female',
        name: 'Female'
      }
    ];
    $scope.configObj.photo = null;
    $scope.configObj.age = null;
    $scope.configObj.patient_genders = [];
    $scope.configObj.maxDate = new Moment();
    $scope.configObj.minDate = new Moment().subtract(150, 'years');
    $scope.configObj.dateOptions = {
      formatYear: 'yyyy',
      startingDay: 6
    };
    $scope.configObj.format = 'yyyy/MM/dd';
    $scope.configObj.opened = false;
    $scope.configObj.photoCss = null;
    $scope.configObj.personalPhotoPath = null;
    //region Date functions
    $scope.today = function () {
      $scope.patient.birthDate = new Moment();
    };
    $scope.clear = function () {
      $scope.patient.birthDate = null;
    };
    $scope.openDatePicker = function ($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.configObj.opened = true;
    };
    $scope.ageChanged = function (newAge) {
      $scope.patient.birthDate = new Moment().subtract(newAge, 'years').format('YYYY/MM/DD');
    };
    $scope.birthDateChanged = function (birthDate) {
      $scope.configObj.age = new Moment().diff(new Moment(birthDate), 'years');
    };
    //endregion Date Functions
    //region Helper functions
    lodash.mixin({
      'findByValues': function (collection, property, values) {
        return lodash.filter(collection, function (item) {
          return lodash.contains(values, item[property]);
        });
      }
    });
    lodash.mixin({
      'findByValuesInPath': function (collection, property, values, path) {
        return lodash.filter(collection, function (item) {
          return lodash.contains(lodash.map(values, path), item[property]);
        });
      }
    });
    //endregion Helper functions
    //region Photo
    $scope.openModal = function (size) {
      var modalInstance = $modal.open({
          templateUrl: 'myModalContent.html',
          controller: 'ModalInstanceCtrl',
          size: size,
          resolve: {
            items: function () {
              return $scope.items;
            }
          }
        });
      modalInstance.result.then(function (finalPhoto) {
        $scope.configObj.photo = finalPhoto;
        $scope.configObj.photoCss = '{\'background-image\': \'url(\'+$scope.configObj.photo+\')\'}';
      }, function () {
      });
    };
    //endregion Photo
    //select Gender
    $scope.toggleGenderSelection = function (gender_id) {
      $scope.patient.gender = gender_id;
    };
    var dataURItoBlob = function (dataURI) {
      var binary = atob(dataURI.split(',')[1]);
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
      var array = [];
      for (var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }
      return new Blob([new Uint8Array(array)], { type: mimeString });
    };
    // Create new Patient
    $scope.create = function () {
      // Create new Patient object
      var patient = angular.fromJson(angular.toJson($scope.patient));
      if ($scope.configObj.photo) {
        lodash.extend(patient, { personalPhoto: true });
      }
      var blob = $scope.configObj.photo ? dataURItoBlob($scope.configObj.photo) : null;
      $upload.upload({
        url: '/patients',
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data' },
        data: patient,
        file: blob
      }).success(function (response, status) {
        $location.path('patients/' + response._id);
        if (response.warn) {
          Logger.warn(response.error.message, true);
        } else {
          ///log success message
          Logger.success('Patient created successfully', true);
        }
        // Clear form fields
        $scope.initOne();
      }).error(function (err) {
        Logger.error(err.message, true);  //$scope.error = errorResponse.data.message;
      });
    };
    // Remove existing Patient
    $scope.remove = function (patient) {
      if (patient) {
        patient.$remove(function () {
          for (var i in $scope.patients) {
            if ($scope.patients[i] === patient) {
              $scope.patients.splice(i, 1);
            }
          }
          ///log success message
          Logger.success('Patient deleted successfully', true);
        }, function (errorResponse) {
          ///log error message
          Logger.error(errorResponse.data.message, true);
        });
      } else {
        $scope.patient.$remove(function () {
          $location.path('patients');
          ///log success message
          Logger.success('Patient deleted successfully', true);
        }, function (errorResponse) {
          ///log error message
          Logger.error(errorResponse.data.message, true);
        });
      }
    };
    //redirect to examination
    $scope.examine = function () {
      $location.path('examinations/create/' + $scope.patient._id);
    };
    // Update existing Patient
    $scope.update = function () {
      var patient = angular.fromJson(angular.toJson($scope.patient));
      if ($scope.configObj.photo) {
        lodash.extend(patient, { personalPhoto: true });
      }
      var blob = $scope.configObj.photo ? dataURItoBlob($scope.configObj.photo) : null;
      $upload.upload({
        url: '/patients/' + patient._id,
        method: 'PUT',
        headers: { 'Content-Type': 'multipart/form-data' },
        data: patient,
        file: blob
      }).success(function (response, status) {
        $location.path('patients/' + response._id);
        if (response.warn) {
          Logger.warn(response.error.message, true);
        } else {
          ///log success message
          Logger.success('Patient updated successfully', true);
        }
        // Clear form fields
        $scope.initOne();
      }).error(function (err) {
        Logger.error(err.message, true);  //$scope.error = errorResponse.data.message;
      });
    };
    // Find a list of Patients
    /*$scope.find = function () {
            Patients.query(function (_patients) {
                $scope.patients = _patients;
            });

        };*/
    // Find existing Patient
    $scope.findOne = function (callback) {
      Patients.get({ patientId: $stateParams.patientId }, function (patient) {
        $scope.patient = patient;
        CoreProperties.setPageSubTitle(patient.fullName);
        $scope.configObj.age = new Moment().diff(new Moment($scope.patient.birthDate, 'YYYY/MM/DD'), 'years');
        if ($scope.patient.personalPhoto) {
          $scope.configObj.personalPhotoPath = 'patients/personal-photo/' + $scope.patient._id;
        }
        if (callback) {
          callback();
        }
      });
    };
    // Search existing patients
    $scope.search = function (callback) {
      $scope.patient.paginationConfig = {};
      $scope.patient.paginationConfig.pageNo = $scope.paginationConfig.currentPage;
      $scope.patient.paginationConfig.pageSize = $scope.paginationConfig.pageSize;
      Patients.query($scope.patient, function (_res) {
        $scope.patients = _res.list;
        if (callback) {
          callback(_res.count);
        }
      });
    };
    // Find existing Patient
    $scope.initOne = function () {
      $scope.patient = new Patients({});
    };
    $scope.initCreate = function () {
      $scope.initOne();
      Toolbar.addToolbarCommand('savePatient', 'create_patient', 'Save', 'floppy-save', 0);
    };
    $scope.initEdit = function () {
      $scope.findOne(function () {
        Toolbar.addToolbarCommand('updatePatient', 'edit_patient', 'Save', 'floppy-save', 0);
      });
    };
    $scope.initView = function () {
      $scope.findOne(function () {
        Toolbar.addToolbarCommand('examinePatient', 'create_examination', 'Examine', 'eye-open', 0);
        Toolbar.addToolbarCommand('patientExaminations', 'list_examinations', 'List', 'list', 1);
        Toolbar.addToolbarCommand('editPatient', 'edit_patient', 'Edit', 'edit', 2);
        Toolbar.addToolbarCommand('deletePatient', 'delete_patient', 'Delete', 'trash', 3, null, 'Are you sure to delete patient "' + $scope.patient.fullName + '"?');
      });
    };
    $scope.initSearch = function () {
      $scope.initOne();
      $scope.tabsConfig = {};
      $scope.tabsConfig.showResuls = false;
      $scope.paginationConfig = {};
      $scope.paginationConfig.pageSize = 10;
      $scope.paginationConfig.currentPage = 1;
      $scope.paginationConfig.totalItems = 0;
      $scope.paginationConfig.maxSize = 2;
      $scope.paginationConfig.numPages = 1;
      $scope.paginationConfig.pageSizeOptions = [
        10,
        50,
        100
      ];
      $scope.paginationConfig.showPagination = false;
      Toolbar.addToolbarCommand('searchPatient', 'list_patients', 'Search', 'search', 0);
    };
    $scope.initList = function () {
      $scope.initOne();
      $scope.tabsConfig = {};
      $scope.tabsConfig.showResuls = false;
      $scope.paginationConfig = {};
      $scope.paginationConfig.pageSize = 10;
      $scope.paginationConfig.currentPage = 1;
      $scope.paginationConfig.totalItems = 0;
      $scope.paginationConfig.maxSize = 2;
      $scope.paginationConfig.numPages = 1;
      $scope.paginationConfig.pageSizeOptions = [
        10,
        50,
        100
      ];
      $scope.paginationConfig.showPagination = false;
      $scope.fireSearch();
    };
    $scope.getShowPagination = function () {
      //console.log($scope.paginationConfig.totalItems);
      return $scope.paginationConfig.totalItems > 0;
    };
    $scope.pageChanged = function () {
      //console.log($scope.paginationConfig.currentPage);
      $scope.fireSearch();
    };
    $scope.getNumOfPages = function () {
      return $scope.paginationConfig.totalItems / $scope.paginationConfig.maxSize;
    };
    $scope.selectPageSizeOption = function (_option) {
      if ($scope.isPageSizeOptionEnabled(_option)) {
        $scope.paginationConfig.pageSize = _option;
        $scope.fireSearch();
      }
    };
    $scope.isPageSizeOptionEnabled = function (_option) {
      var optionIndex = $scope.paginationConfig.pageSizeOptions.indexOf(_option);
      if (optionIndex == 0) {
        return true;
      }
      return $scope.paginationConfig.pageSizeOptions[optionIndex - 1] < $scope.paginationConfig.totalItems;
    };
    $scope.isPageSizeOptionSelecetd = function (_option) {
      return $scope.paginationConfig.pageSize == _option;
    };
    ActionsHandler.onActionFired('savePatient', $scope, function (action, args) {
      $scope.create();
    });
    ActionsHandler.onActionFired('updatePatient', $scope, function (action, args) {
      $scope.update();
    });
    ActionsHandler.onActionFired('examinePatient', $scope, function (action, args) {
      $scope.examine();
    });
    ActionsHandler.onActionFired('patientExaminations', $scope, function (action, args) {
      $location.path('examinations/patient/' + $scope.patient._id);
    });
    ActionsHandler.onActionFired('editPatient', $scope, function (action, args) {
      $location.path('patients/' + $scope.patient._id + '/edit');
    });
    ActionsHandler.onActionFired('deletePatient', $scope, function (action, args) {
      $scope.remove();
    });
    ActionsHandler.onActionFired('searchPatient', $scope, function (action, args) {
      $scope.fireSearch();
    });
    $scope.fireSearch = function () {
      $scope.search(function (_count) {
        $scope.tabsConfig.showResults = true;
        $scope.paginationConfig.totalItems = _count;
        $scope.paginationConfig.showPagination = $scope.getShowPagination();
        $scope.paginationConfig.numPages = $scope.getNumOfPages();
      });
    };
  }
]);
angular.module('patients').controller('ModalInstanceCtrl', [
  '$scope',
  '$modalInstance',
  'items',
  'Logger',
  function ($scope, $modalInstance, items, Logger) {
    $scope.modalConfig = {};
    $scope.modalConfig.tabs = [
      {
        active: true,
        disabled: false
      },
      {
        active: false,
        disabled: false
      },
      {
        active: false,
        disabled: true
      }
    ];
    $scope.modalConfig.photoWidth = null;
    $scope.modalConfig.photoHeight = null;
    $scope.modalConfig.finalPhoto = null;
    $scope.modalConfig.photos = [];
    $scope.modalConfig.selectedPhoto = null;
    $scope.modalConfig.inputImage = null;
    $scope.modalConfig.webcamError = false;
    //$scope.tabs = [
    //  { active: true, disabled: false },
    //  { active: false, disabled: false },
    //  { active: false, disabled: true }
    //];
    //$scope.photoWidth = null;
    //$scope.photoHeight = null;
    //$scope.finalPhoto = null;
    //$scope.photos = [];
    //$scope.selectedPhoto = null;
    //$scope.inputImage = null;
    //$scope.webcamError = false;
    var _video = null;
    $scope.onSuccess = function (videoElem) {
      _video = videoElem;
    };
    var getVideoData = function getVideoData() {
      var hiddenCanvas = document.createElement('canvas');
      hiddenCanvas.width = _video.width;
      hiddenCanvas.height = _video.height;
      var ctx = hiddenCanvas.getContext('2d');
      ctx.drawImage(_video, 0, 0, _video.width, _video.height);
      $scope.modalConfig.photoWidth = document.defaultView.getComputedStyle(_video, '').getPropertyValue('width');
      $scope.modalConfig.photoHeight = document.defaultView.getComputedStyle(_video, '').getPropertyValue('height');
      return hiddenCanvas.toDataURL();
    };
    $scope.makeSnapshot = function makeSnapshot() {
      if (_video) {
        var idata = getVideoData();
        $scope.modalConfig.photos.push({ src: idata });
      }
    };
    var img = new Image();
    img.onload = function () {
      var width = this.width;
      var height = this.height;
      var src = this.src;
    };
    $scope.inputPhoto = function (files) {
      var file = files[0];
      var reader = new FileReader();
      reader.onload = function (evt) {
        $scope.$apply(function ($scope) {
          $scope.modalConfig.inputImage = evt.target.result;
          img.src = evt.target.result;
        });
      };
      reader.readAsDataURL(file);
    };
    $scope.selectInputPhoto = function () {
      $scope.modalConfig.photoWidth = img.width;
      $scope.modalConfig.photoHeight = img.height;
      $scope.modalConfig.tabs[2].disabled = false;
    };
    $scope.selectPhoto = function (photo) {
      $scope.modalConfig.selectedPhoto = photo;
      $scope.modalConfig.tabs[2].disabled = false;
      $scope.modalConfig.tabs[2].active = true;
    };
    $scope.onCamError = function (err) {
      $scope.$apply(function () {
        $scope.modalConfig.webcamError = err;
      });
    };
    $scope.photoCropped = function ($dataURI) {
      $scope.modalConfig.finalPhoto = $dataURI;
    };
    $scope.ok = function () {
      $modalInstance.close($scope.modalConfig.finalPhoto);
    };
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }
]);
angular.module('patients').directive('backImg', function () {
  return function (scope, element, attrs) {
    attrs.$observe('backImg', function (value) {
      element.css({ 'background-image': 'url(' + value + ')' });
    });
  };
});
angular.module('patients').directive('widthCss', function () {
  return function (scope, element, attrs) {
    attrs.$observe('widthCss', function (value) {
      element.css({ 'width': value });
    });
  };
});
angular.module('patients').directive('heightCss', function () {
  return function (scope, element, attrs) {
    attrs.$observe('heightCss', function (value) {
      element.css({ 'height': value });
    });
  };
});'use strict';
//Patients service used to communicate Patients REST endpoints
angular.module('patients').factory('Patients', [
  '$resource',
  function ($resource) {
    return $resource('patients/:patientId', { patientId: '@_id' }, {
      update: { method: 'PUT' },
      query: { isArray: false }
    });
  }
]);  /*
 angular.module('patients').factory('Patient',function(){
 var currentPatient = null;

 var setCurrentPatient = function(patient) {
 currentPatient=patient;
 };

 var getCurrentPatient = function(){
 return currentPatient;
 };

 return {
 setCurrentPatient: setCurrentPatient,
 getCurrentPatient: getCurrentPatient
 };
 });*/'use strict';
// Configuring the Articles module
angular.module('roles').run([
  'Menus',
  function (Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', 'Roles', 'roles', 'dropdown', '/roles(/create)?(/search)?', false, 0);
    Menus.addSubMenuItem('topbar', 'roles', 'List Roles', 'roles', '/roles', false, 'list_roles', 0);
    Menus.addSubMenuItem('topbar', 'roles', 'New Role', 'roles/create', '/roles/create', false, 'create_role', 1);
    Menus.addSubMenuItem('topbar', 'roles', 'Search Roles', 'roles/search', '/roles/search', false, 'list_roles', 2);
  }
]);'use strict';
//Setting up route
angular.module('roles').config([
  '$stateProvider',
  function ($stateProvider) {
    /*console.log('config roles module');*/
    /*var isAuthorized=function($q, $timeout, $resource, $location){
         var deferred = $q.defer();
         // Make an AJAX call to check if the user is logged in
         $resource('/auth/is-authorized/list_roles').get().$promise.then(function(response){
         alert('success');
         alert(JSON.stringify(response));
         deferred.resolve();
         }, function (errorResponse) {
         ///log error message
         alert('error');
         alert(JSON.stringify(errorResponse));
         deferred.reject();
         $location.url('/');
         //$scope.error = errorResponse.data.message;
         });*/
    /*$http.get('/auth/is-authorized').success(function(authorized) {
         console.log(authorized);
         // Authenticated
         if (authorized) {
         $timeout(deferred.resolve);
         }
         // Not Authenticated
         else {
         $timeout(deferred.reject);
         $location.url('/');
         }
         }).error(function (data, status, headers, config) {
         //console.log("error");
         alert("error");

         */
    /* console.log(data);
         console.log(status);
         console.log(headers);
         console.log(config);*/
    /*

         $timeout(deferred.reject);
         $location.url('/');
         });

         return deferred.promise;
         };*/
    // Roles state routing
    $stateProvider.state('listRoles', {
      url: '/roles',
      templateUrl: 'modules/roles/views/list-roles.client.view.html',
      requiresLogin: true,
      action: 'list_roles',
      title: 'Roles'
    }).state('createRole', {
      url: '/roles/create',
      templateUrl: 'modules/roles/views/create-role.client.view.html',
      requiresLogin: true,
      action: 'create_role',
      title: 'New Role'
    }).state('searchRoles', {
      url: '/roles/search',
      templateUrl: 'modules/roles/views/search-roles.client.view.html',
      requiresLogin: true,
      action: 'list_roles',
      title: 'Search Roles'
    }).state('editRole', {
      url: '/roles/:roleId/edit',
      templateUrl: 'modules/roles/views/edit-role.client.view.html',
      requiresLogin: true,
      action: 'edit_role',
      title: 'Edit Role'
    }).state('viewRole', {
      url: '/roles/:roleId',
      templateUrl: 'modules/roles/views/view-role.client.view.html',
      requiresLogin: true,
      action: 'view_role',
      title: 'View Role'
    });
  }
]);'use strict';
// Roles controller
angular.module('roles').controller('RolesController', [
  '$scope',
  '$stateParams',
  '$location',
  'Roles',
  'Module',
  'Action',
  'Logger',
  'ActionsHandler',
  'Toolbar',
  'lodash',
  function ($scope, $stateParams, $location, Roles, Module, Action, Logger, ActionsHandler, Toolbar, lodash) {
    /**
         * Init variables
         */
    $scope._ = lodash;
    //region Helper functions
    lodash.mixin({
      'findByValues': function (collection, property, values) {
        return lodash.filter(collection, function (item) {
          return lodash.contains(values, item[property]);
        });
      }
    });
    lodash.mixin({
      'findByValuesInPath': function (collection, property, values, path) {
        return lodash.filter(collection, function (item) {
          return lodash.contains(lodash.map(values, path), item[property]);
        });
      }
    });
    //endregion Helper functions
    /*var _modules = $scope.modules || Module.query(function () {
         $scope.modules = _modules
         });
         $scope.selected_modules = [];
         var _all_actions = $scope.all_actions || Action.query(function () {
         $scope.all_actions = _all_actions;
         });
         $scope.selected_module = $scope.selected_module || null;
         $scope.selected_action = $scope.selected_action || null;
         $scope.actions = $scope.actions || [];
         */
    /*$scope.role_actions = $scope.role_actions || [];*/
    /*
         $scope.role_actions = [];*/
    $scope.initActions = function (callback) {
      $scope.actionsObj = {};
      $scope.actionsObj.selected_modules = [];
      $scope.actionsObj.actions = [];
      $scope.actionsObj.role_actions = [];
      $scope.actionsObj.selected_module = null;
      $scope.actionsObj.selected_action = null;
      Module.query(function (_modules) {
        $scope.actionsObj.modules = _modules;
        Action.query(function (_all_actions) {
          $scope.actionsObj.all_actions = _all_actions;
          callback();
        });
      });
    };
    $scope.$watch('actionsObj.selected_module', function (value) {
      if ($scope.actionsObj.selected_module) {
        $scope.actionsObj.actions = lodash.where($scope.actionsObj.all_actions, { '_module': $scope.actionsObj.selected_module._id });
      }
    }, true);
    $scope.$watch('actionsObj.role_actions', function (value) {
      $scope.actionsObj.selected_modules = [];
      if ($scope.actionsObj.role_actions) {
        for (var i = 0; i < $scope.actionsObj.role_actions.length; i++) {
          var actionModule = lodash.where($scope.actionsObj.modules, { '_id': $scope.actionsObj.role_actions[i]._module });
          if (!lodash.contains($scope.actionsObj.selected_modules, actionModule[0])) {
            $scope.actionsObj.selected_modules.push(actionModule[0]);
          }
        }
      }
    }, true);
    $scope.filterModuleActions = function callbackfn(value, index, array) {
      if (array && $scope.actionsObj.selected_module) {
        if (array[index]._module == $scope.actionsObj.selected_module._id)
          return true;
      }
      return false;
    };
    $scope.initOne = function (callback) {
      $scope.initActions(function () {
        $scope.role = new Roles({});
        if (callback) {
          callback();
        }
      });
    };
    // Create new Role
    $scope.create = function () {
      // Create new Role object
      var _role = $scope.role;
      _role._actions = $scope.actionsObj.role_actions;
      /*var role = new Roles({
             name: this.name,
             _actions: this.role_actions
             });*/
      // Redirect after save
      _role.$save(function (response) {
        $location.path('roles/' + response._id);
        ///log success message
        Logger.success('Role created successfully', true);
        /// Clear form fields
        $scope.initOne();
      }, function (errorResponse) {
        ///log error message
        Logger.error(errorResponse.data.message, true);  //$scope.error = errorResponse.data.message;
      });
    };
    // Remove existing Role
    $scope.remove = function (role) {
      if (role) {
        role.$remove(function () {
          for (var i in $scope.roles) {
            if ($scope.roles[i] === role) {
              $scope.roles.splice(i, 1);
            }
          }
          ///log success message
          Logger.success('Role deleted successfully', true);
        }, function (errorResponse) {
          ///log error message
          Logger.error(errorResponse.data.message, true);  //$scope.error = errorResponse.data.message;
        });
      } else {
        $scope.role.$remove(function () {
          ///log success message
          Logger.success('Role deleted successfully', true);
          $location.path('roles');
        }, function (errorResponse) {
          ///log error message
          Logger.error(errorResponse.data.message, true);  //$scope.error = errorResponse.data.message;
        });
      }
    };
    // Update existing Role
    $scope.update = function () {
      var _role = $scope.role;
      _role._actions = $scope.actionsObj.role_actions;
      _role.$update(function () {
        $location.path('roles/' + _role._id);
        ///log success message
        Logger.success('Role updated successfully', true);
      }, function (errorResponse) {
        ///log error message
        Logger.error(errorResponse.data.message, true);  //$scope.error = errorResponse.data.message;
      });
    };
    // Search existing Roles
    $scope.search = function (callback) {
      var role = $scope.role;
      role._actions = $scope.actionsObj.role_actions;
      if ((!role.name || role.name == '' || role.name == undefined) && (!role._actions || role._actions.length == 0)) {
        Logger.error('Please Enter Search Criteria', true);
      } else {
        //var searchCriteria = {name:$scope.name,_actions:$scope.role._actions};
        Roles.query(role, function (_roles) {
          $scope.roles = _roles;
          callback();
        });
      }
    };
    // Find a list of Roles
    $scope.find = function () {
      Roles.query(function (_roles) {
        $scope.roles = _roles;
      });
    };
    // Find existing Role
    $scope.findOne = function (callback) {
      Roles.get({ roleId: $stateParams.roleId }, function (_role) {
        //console.log(_role);
        $scope.role = _role;
        $scope.actionsObj.role_actions = lodash.findByValues($scope.actionsObj.all_actions, '_id', $scope.role._actions);
        for (var i = 0; i < $scope.actionsObj.modules.length; i++) {
          if (lodash.where($scope.role._actions, { '_module': $scope.actionsObj.modules[i]._id }).length > 0) {
            $scope.actionsObj.selected_module = $scope.actionsObj.modules[i];
            break;
          }
        }
        if (callback) {
          callback();
        }
      });
    };
    $scope.initCreate = function () {
      $scope.initOne(function () {
        Toolbar.addToolbarCommand('saveRole', 'create_role', 'Save', 'floppy-save', 0);
      });
    };
    $scope.initEdit = function () {
      $scope.initActions(function () {
        $scope.findOne(function () {
          Toolbar.addToolbarCommand('updateRole', 'edit_role', 'Save', 'floppy-save', 0);
        });
      });
    };
    $scope.initView = function () {
      $scope.initActions(function () {
        $scope.findOne(function () {
          Toolbar.addToolbarCommand('editRole', 'edit_role', 'Edit', 'edit', 1);
          Toolbar.addToolbarCommand('deleteRole', 'delete_role', 'Delete', 'trash', 2, null, 'Are you sure to delete role "' + $scope.role.name + '"?');
        });
      });
    };
    $scope.initSearch = function () {
      $scope.initOne(function () {
        $scope.tabsConfig = {};
        $scope.tabsConfig.showResuls = false;
        Toolbar.addToolbarCommand('searchRole', 'list_roles', 'Search', 'search', 0);
      });
    };
    $scope.initList = function () {
      $scope.initActions(function () {
        $scope.find();
      });
    };
    ActionsHandler.onActionFired('saveRole', $scope, function (action, args) {
      $scope.create();
    });
    ActionsHandler.onActionFired('updateRole', $scope, function (action, args) {
      $scope.update();
    });
    ActionsHandler.onActionFired('editRole', $scope, function (action, args) {
      $location.path('roles/' + $scope.role._id + '/edit');
    });
    ActionsHandler.onActionFired('deleteRole', $scope, function (action, args) {
      $scope.remove();
    });
    ActionsHandler.onActionFired('searchRole', $scope, function (action, args) {
      $scope.search(function () {
        $scope.tabsConfig.showResults = true;
      });
    });
  }
]);'use strict';
//Roles service used to communicate Roles REST endpoints
angular.module('roles').factory('Roles', [
  '$resource',
  function ($resource) {
    return $resource('roles/:roleId', { roleId: '@_id' }, { update: { method: 'PUT' } });
  }
]);'use strict';
// Configuring the Articles module
angular.module('security').run([
  '$rootScope',
  'Authentication',
  '$location',
  'lodash',
  'CoreProperties',
  'Toolbar',
  function ($rootScope, Authentication, $location, lodash, CoreProperties, Toolbar) {
    //console.log($rootScope.authentication.user);
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
      CoreProperties.setPageSubTitle(null);
      Toolbar.clearToolbarCommands();
      if (toState.requiresLogin) {
        if (!Authentication.user) {
          $location.path('/signin');
          return;
        }
        if (toState.action) {
          if (!lodash.contains(Authentication.user._role._actions, toState.action)) {
            $location.path('/not-authorized');
          }
        }
      }
    });
  }
]);'use strict';
// Config HTTP Error Handling
angular.module('users').config([
  '$httpProvider',
  function ($httpProvider) {
    // Set the httpProvider "not authorized" interceptor
    $httpProvider.interceptors.push([
      '$q',
      '$location',
      'Authentication',
      function ($q, $location, Authentication) {
        return {
          responseError: function (rejection) {
            switch (rejection.status) {
            case 401:
              // Deauthenticate the global user
              Authentication.user = null;
              // Redirect to signin page
              $location.path('/signin');
              break;
            case 403:
              // Add unauthorized behaviour
              $location.path('/not-authorized');
              break;
            }
            return $q.reject(rejection);
          }
        };
      }
    ]);
  }
]);  /*
angular.module('users').run(['Menus',
    function(Menus) {
        // Set top bar menu items
        Menus.addMenuItem('topbar', 'Users', 'users', 'dropdown', '/users(/create)?');
        Menus.addSubMenuItem('topbar', 'users', 'List Users', 'users');
        Menus.addSubMenuItem('topbar', 'users', 'New User', 'users/create');
    }
]);*/'use strict';
// Setting up route
angular.module('users').config([
  '$stateProvider',
  function ($stateProvider) {
    /*console.log('config users module');*/
    // Users state routing
    $stateProvider.state('profile', {
      url: '/settings/profile',
      templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
    }).state('password', {
      url: '/settings/password',
      templateUrl: 'modules/users/views/settings/change-password.client.view.html'
    }).state('accounts', {
      url: '/settings/accounts',
      templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
    }).state('signup', {
      url: '/signup',
      templateUrl: 'modules/users/views/authentication/signup.client.view.html'
    }).state('signin', {
      url: '/signin',
      templateUrl: 'modules/users/views/authentication/signin.client.view.html'
    }).state('forgot', {
      url: '/password/forgot',
      templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
    }).state('reset-invlaid', {
      url: '/password/reset/invalid',
      templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
    }).state('reset-success', {
      url: '/password/reset/success',
      templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
    }).state('reset', {
      url: '/password/reset/:token',
      templateUrl: 'modules/users/views/password/reset-password.client.view.html'
    }).state('listUsers', {
      url: '/users',
      templateUrl: 'modules/users/views/list-users.client.view.html',
      requiresLogin: true,
      action: 'list_users'
    }).state('createUser', {
      url: '/users/create',
      templateUrl: 'modules/users/views/create-user.client.view.html',
      requiresLogin: true,
      action: 'create_user'
    }).state('viewUser', {
      url: '/users/:userId',
      templateUrl: 'modules/users/views/view-user.client.view.html',
      requiresLogin: true,
      action: 'view_user'
    }).state('editUser', {
      url: '/users/:userId/edit',
      templateUrl: 'modules/users/views/edit-user.client.view.html',
      requiresLogin: true,
      action: 'edit_user'
    });
  }
]);'use strict';
angular.module('users').controller('AuthenticationController', [
  '$scope',
  '$http',
  '$location',
  'Authentication',
  function ($scope, $http, $location, Authentication) {
    $scope.authentication = Authentication;
    // If user is signed in then redirect back home
    if ($scope.authentication.user)
      $location.path('/');
    $scope.signup = function () {
      $http.post('/auth/signup', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;
        // And redirect to the index page
        $location.path('/');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    $scope.signin = function () {
      $http.post('/auth/signin', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;
        // And redirect to the index page
        $location.path('/');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
angular.module('users').controller('PasswordController', [
  '$scope',
  '$stateParams',
  '$http',
  '$location',
  'Authentication',
  function ($scope, $stateParams, $http, $location, Authentication) {
    $scope.authentication = Authentication;
    //If user is signed in then redirect back home
    if ($scope.authentication.user)
      $location.path('/');
    // Submit forgotten password account id
    $scope.askForPasswordReset = function () {
      $scope.success = $scope.error = null;
      $http.post('/auth/forgot', $scope.credentials).success(function (response) {
        // Show user success message and clear form
        $scope.credentials = null;
        $scope.success = response.message;
      }).error(function (response) {
        // Show user error message and clear form
        $scope.credentials = null;
        $scope.error = response.message;
      });
    };
    // Change user password
    $scope.resetUserPassword = function () {
      $scope.success = $scope.error = null;
      $http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.passwordDetails = null;
        // Attach user profile
        Authentication.user = response;
        // And redirect to the index page
        $location.path('/password/reset/success');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
angular.module('users').controller('SettingsController', [
  '$scope',
  '$http',
  '$location',
  'Users',
  'Authentication',
  function ($scope, $http, $location, Users, Authentication) {
    $scope.user = Authentication.user;
    // If user is not signed in then redirect back home
    if (!$scope.user)
      $location.path('/');
    // Check if there are additional accounts 
    $scope.hasConnectedAdditionalSocialAccounts = function (provider) {
      for (var i in $scope.user.additionalProvidersData) {
        return true;
      }
      return false;
    };
    // Check if provider is already in use with current user
    $scope.isConnectedSocialAccount = function (provider) {
      return $scope.user.provider === provider || $scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider];
    };
    // Remove a user social account
    $scope.removeUserSocialAccount = function (provider) {
      $scope.success = $scope.error = null;
      $http.delete('/users/accounts', { params: { provider: provider } }).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.user = Authentication.user = response;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    // Update a user profile
    $scope.updateUserProfile = function (isValid) {
      if (isValid) {
        $scope.success = $scope.error = null;
        var user = new Users($scope.user);
        user.$update(function (response) {
          $scope.success = true;
          Authentication.user = response;
        }, function (response) {
          $scope.error = response.data.message;
        });
      } else {
        $scope.submitted = true;
      }
    };
    // Change user password
    $scope.changeUserPassword = function () {
      $scope.success = $scope.error = null;
      $http.post('/users/password', $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.passwordDetails = null;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
// Roles controller
angular.module('users').controller('UsersController', [
  '$scope',
  '$stateParams',
  '$location',
  'Authentication',
  'Users',
  'Roles',
  'lodash',
  'Logger',
  function ($scope, $stateParams, $location, Authentication, Users, Roles, lodash, Logger) {
    /**
         * Init variables
         */
    $scope.authentication = Authentication;
    $scope._ = lodash;
    $scope.roles = Roles.query();
    /**
         * Helper functions
         */
    lodash.mixin({
      'findByValues': function (collection, property, values) {
        return lodash.filter(collection, function (item) {
          return lodash.contains(values, item[property]);
        });
      }
    });
    lodash.mixin({
      'findByValuesInPath': function (collection, property, values, path) {
        return lodash.filter(collection, function (item) {
          return lodash.contains(lodash.map(values, path), item[property]);
        });
      }
    });
    //select Role
    $scope.toggleRoleSelection = function (role_id) {
      $scope.user._role = role_id;
    };
    // Create new User
    $scope.create = function () {
      // Get new User object
      var user = $scope.user;
      // Redirect after save
      user.$save(function (response) {
        $location.path('users/' + response._id);
        ///log success message
        Logger.success('User created successfully', true);
        // Clear form fields
        $scope.initOne();
      }, function (errorResponse) {
        console.log(errorResponse);
        ///log error message
        Logger.error(errorResponse.data.message, true);  //$scope.error = errorResponse.data.message;
      });
    };
    // Remove existing User
    $scope.remove = function (user) {
      if (user) {
        user.$remove(function () {
          for (var i in $scope.users) {
            if ($scope.users[i] === user) {
              $scope.users.splice(i, 1);
            }
          }
          ///log success message
          Logger.success('User deleted successfully', true);
        }, function (errorResponse) {
          ///log error message
          Logger.error(errorResponse.data.message, true);
        });
      } else {
        $scope.user.$remove(function () {
          $location.path('users');
          ///log success message
          Logger.success('User deleted successfully', true);
        }, function (errorResponse) {
          ///log error message
          Logger.error(errorResponse.data.message, true);
        });
      }
    };
    // Update existing User
    $scope.update = function () {
      var user = $scope.user;
      user.$update(function () {
        $location.path('users/' + user._id);
        ///log success message
        Logger.success('User updated successfully', true);
      }, function (errorResponse) {
        ///log error message
        Logger.error(errorResponse.data.message, true);  //$scope.error = errorResponse.data.message;
      });
    };
    // Find a list of Users
    $scope.find = function () {
      $scope.users = Users.query();
    };
    // Find existing User
    $scope.findOne = function () {
      $scope.user = Users.get({ userId: $stateParams.userId });
    };
    // Init New User
    $scope.initOne = function () {
      $scope.user = new Users({ password: Math.random().toString(36).slice(-8) });
    };
  }
]);'use strict';
// Authentication service for user variables
angular.module('users').factory('Authentication', [function () {
    var _this = this;
    _this._data = { user: window.user };
    return _this._data;
  }]);'use strict';
// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', [
  '$resource',
  function ($resource) {
    return $resource('users/:userId', { userId: '@_id' }, { update: { method: 'PUT' } });
  }
]);