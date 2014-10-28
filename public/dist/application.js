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
        'angularFileUpload'
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
  function ($scope, Authentication, Menus) {
    $scope.authentication = Authentication;
    $scope.isCollapsed = false;
    $scope.menu = Menus.getMenu('topbar');
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };
    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });
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
            var result = confirm(atts.delMessage);
            if (result) {
              //apply only
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
// Configuring the Articles module
angular.module('manage-users').run([
  'Menus',
  function (Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', 'Users', 'manage-users', 'dropdown', '/manage-users(/create)?', false, 1);
    Menus.addSubMenuItem('topbar', 'manage-users', 'List users', 'manage-users', '/manage-users', false, 'list_users', 0);
    Menus.addSubMenuItem('topbar', 'manage-users', 'New user', 'manage-users/create', '/manage-users/create', false, 'create_user', 1);
  }
]);'use strict';
//Setting up route
angular.module('manage-users').config([
  '$stateProvider',
  function ($stateProvider) {
    // Manage users state routing
    $stateProvider.state('listManageUsers', {
      url: '/manage-users',
      templateUrl: 'modules/manage-users/views/list-manage-users.client.view.html'
    }).state('createManageUser', {
      url: '/manage-users/create',
      templateUrl: 'modules/manage-users/views/create-manage-user.client.view.html'
    }).state('viewManageUser', {
      url: '/manage-users/:manageUserId',
      templateUrl: 'modules/manage-users/views/view-manage-user.client.view.html'
    }).state('editManageUser', {
      url: '/manage-users/:manageUserId/edit',
      templateUrl: 'modules/manage-users/views/edit-manage-user.client.view.html'
    });
  }
]);'use strict';
// Manage users controller
angular.module('manage-users').controller('ManageUsersController', [
  '$scope',
  '$stateParams',
  '$location',
  'Authentication',
  'ManageUsers',
  'Roles',
  'lodash',
  'Logger',
  function ($scope, $stateParams, $location, Authentication, ManageUsers, Roles, lodash, Logger) {
    //region Init variables
    $scope.authentication = Authentication;
    $scope._ = lodash;
    $scope.roles = Roles.query();
    //endregion Init variables
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
    //select Role
    $scope.toggleRoleSelection = function (role_id) {
      //console.log(role_id);
      $scope.manageUser._role = role_id;  //console.log($scope.manageUser._role);
    };
    // Init New Managed User
    $scope.initOne = function () {
      $scope.manageUser = new ManageUsers({ password: Math.random().toString(36).slice(-8) });
    };
    //endregion Helper functions
    //region CRUD functions
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
        //console.log(errorResponse);
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
    $scope.findOne = function () {
      $scope.manageUser = ManageUsers.get({ manageUserId: $stateParams.manageUserId });
    };  //endregion CRUD functions
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
      action: 'list_patients'
    }).state('createPatient', {
      url: '/patients/create',
      templateUrl: 'modules/patients/views/create-patient.client.view.html',
      action: 'create_patient'
    }).state('viewPatient', {
      url: '/patients/:patientId',
      templateUrl: 'modules/patients/views/view-patient.client.view.html',
      action: 'view_patient'
    }).state('editPatient', {
      url: '/patients/:patientId/edit',
      templateUrl: 'modules/patients/views/edit-patient.client.view.html',
      action: 'edit_patient'
    });
  }
]);'use strict';
// Patients controller
angular.module('patients').controller('PatientsController', [
  '$scope',
  '$stateParams',
  '$location',
  'Authentication',
  'Patients',
  'Logger',
  'lodash',
  'moment',
  '$modal',
  '$upload',
  function ($scope, $stateParams, $location, Authentication, Patients, Logger, lodash, Moment, $modal, $upload) {
    $scope.authentication = Authentication;
    $scope._ = lodash;
    $scope.Moment = Moment;
    $scope.genders = [
      {
        _id: 'male',
        name: 'Male'
      },
      {
        _id: 'female',
        name: 'Female'
      }
    ];
    $scope.photo = null;
    //$scope.photoCss = "{'background-image': 'url('+$scope.photo+')'}";
    //region Date functions
    $scope.today = function () {
      $scope.patient.birthDate = new Moment();
    };
    $scope.clear = function () {
      $scope.patient.birthDate = null;
    };
    $scope.maxDate = new Moment();
    $scope.minDate = new Moment().subtract(150, 'years');
    $scope.openDatePicker = function ($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.opened = true;
    };
    $scope.dateOptions = {
      formatYear: 'yyyy',
      startingDay: 6
    };
    $scope.format = 'yyyy/MM/dd';
    $scope.ageChanged = function (age) {
      $scope.patient.birthDate = new Moment().subtract(age, 'years').format('YYYY/MM/DD');
    };
    $scope.birthDateChanged = function (birthDate) {
      $scope.patient.age = new Moment().diff(new Moment(birthDate), 'years');
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
    //$scope.items = ['item1', 'item2', 'item3'];
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
        //console.log(finalPhoto);
        $scope.photo = finalPhoto;
        $scope.photoCss = '{\'background-image\': \'url(\'+$scope.photo+\')\'}';
      }, function () {
      });
    };
    //endregion Photo
    //select Gender
    $scope.toggleGenderSelection = function (gender_id) {
      //console.log(role_id);
      $scope.patient.gender = gender_id;  //console.log($scope.manageUser._role);
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
      if ($scope.photo) {
        lodash.extend(patient, { personalPhoto: true });
      }
      var blob = $scope.photo ? dataURItoBlob($scope.photo) : null;
      $upload.upload({
        url: '/patients',
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data' },
        data: patient,
        file: blob,
        fileName: 'personal-photo'
      }).success(function (response, status) {
        $location.path('patients/' + response.id);
        if (response.warn) {
          Logger.warn(response.error.message, true);
        } else {
          ///log success message
          Logger.success('Patient created successfully', true);
        }
        // Clear form fields
        $scope.initOne();
      }).error(function (err) {
        Logger.error(err, true);
      });  // Redirect after save
           /*patient.$save(function (response) {


             }, function (errorResponse) {
             ///log error message
             Logger.error(errorResponse.data.message, true);

             //$scope.error = errorResponse.data.message;
             });*/
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
    // Update existing Patient
    $scope.update = function () {
      var patient = $scope.patient;
      patient.$update(function () {
        $location.path('patients/' + patient.id);
        ///log success message
        Logger.success('Patient updated successfully', true);
      }, function (errorResponse) {
        ///log error message
        Logger.error(errorResponse.data.message, true);  //$scope.error = errorResponse.data.message;
      });
    };
    // Find a list of Patients
    $scope.find = function () {
      $scope.patients = Patients.query();
    };
    // Find existing Patient
    $scope.findOne = function () {
      $scope.patient = Patients.get({ patientId: $stateParams.patientId }, function () {
        if ($scope.patient.personalPhoto) {
          var filePath = 'patients/personal-photo/' + $scope.patient.id;
          $scope.patient.personalPhoto = filePath;
        }
      });
    };
    // Find existing Patient
    $scope.initOne = function () {
      $scope.patient = new Patients({});
    };
  }
]);
angular.module('patients').controller('ModalInstanceCtrl', [
  '$scope',
  '$modalInstance',
  'items',
  'Logger',
  function ($scope, $modalInstance, items, Logger) {
    //region Tabs
    $scope.tabs = [
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
    //endregion Tabs
    var _video = null;
    $scope.photos = [];
    $scope.onSuccess = function (videoElem) {
      _video = videoElem;
    };
    $scope.photoWidth = null;
    $scope.photoHeight = null;
    $scope.finalPhoto = null;
    var getVideoData = function getVideoData() {
      var hiddenCanvas = document.createElement('canvas');
      hiddenCanvas.width = _video.width;
      hiddenCanvas.height = _video.height;
      var ctx = hiddenCanvas.getContext('2d');
      ctx.drawImage(_video, 0, 0, _video.width, _video.height);
      $scope.photoWidth = document.defaultView.getComputedStyle(_video, '').getPropertyValue('width');
      $scope.photoHeight = document.defaultView.getComputedStyle(_video, '').getPropertyValue('height');
      return hiddenCanvas.toDataURL();  //ctx.getImageData(0, 0,_video.width, _video.height);
    };
    $scope.makeSnapshot = function makeSnapshot() {
      //console.log('makeSnapshot');
      if (_video) {
        //console.log(_video);
        var idata = getVideoData();
        //console.log(idata);
        $scope.photos.push({ src: idata });
      }
    };
    $scope.selectedPhoto = null;
    var img = new Image();
    img.onload = function () {
      var width = this.width;
      var height = this.height;
      var src = this.src;  /*$scope.photoWidth = width;
         $scope.photoHeight = height;
         $scope.selectPhoto(src);*/
                           //$scope.photoWidth = width;
                           //$scope.photoHeight = height;
                           /*$scope.$apply(function($scope) {
         $scope.photoWidth = width;
         $scope.photoHeight = height;

         //$scope.selectPhoto(src);
         });*/
    };
    $scope.inputImage = null;
    $scope.inputPhoto = function (files) {
      var file = files[0];
      //console.log(file);
      var reader = new FileReader();
      reader.onload = function (evt) {
        //console.log(evt);
        $scope.$apply(function ($scope) {
          $scope.inputImage = evt.target.result;
          img.src = evt.target.result;  //$scope.selectedPhoto=evt.target.result;
                                        //console.log(evt.target.result);
                                        //$scope.tabs[2].disabled=false;
                                        //$scope.tabs[2].active=true;
        });
      };
      reader.readAsDataURL(file);
    };
    $scope.selectInputPhoto = function () {
      $scope.photoWidth = img.width;
      $scope.photoHeight = img.height;
      console.log($scope.photoWidth);
      console.log($scope.photoHeight);
      $scope.tabs[2].disabled = false;  //$scope.tabs[2].active=true;
    };
    $scope.selectPhoto = function (photo) {
      //console.log('select photop');
      //console.log($scope.photoWidth);
      //console.log($scope.photoHeight);
      $scope.selectedPhoto = photo;
      $scope.tabs[2].disabled = false;
      $scope.tabs[2].active = true;
    };
    /*$scope.savePhoto=function(media){
     console.log('media\n\r');
     console.log(media);
     };*/
    $scope.webcamError = false;
    $scope.onCamError = function (err) {
      $scope.$apply(function () {
        $scope.webcamError = err;
      });
    };
    $scope.photoCropped = function ($dataURI) {
      $scope.finalPhoto = $dataURI;  //console.log($dataURI);
    };
    $scope.ok = function () {
      //console.log($scope.finalPhoto);
      $modalInstance.close($scope.finalPhoto);
    };
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };  //alert(err);
        //Logger.error(err,true);
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
    return $resource('patients/:patientId', { patientId: '@id' }, { update: { method: 'PUT' } });
  }
]);'use strict';
// Configuring the Articles module
angular.module('roles').run([
  'Menus',
  function (Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', 'Roles', 'roles', 'dropdown', '/roles(/create)?(/search)?', false, 0);
    Menus.addSubMenuItem('topbar', 'roles', 'List Roles', 'roles', '/roles', false, 'list_roles', 0);
    Menus.addSubMenuItem('topbar', 'roles', 'New Role', 'roles/create', '/roles/create', false, 'create_role', 1);
    Menus.addSubMenuItem('topbar', 'roles', 'Search Roles', 'roles/search', '/roles/search', false, 'search_roles', 2);
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
      action: 'list_roles'
    }).state('createRole', {
      url: '/roles/create',
      templateUrl: 'modules/roles/views/create-role.client.view.html',
      requiresLogin: true,
      action: 'create_role'
    }).state('searchRoles', {
      url: '/roles/search',
      templateUrl: 'modules/roles/views/search-roles.client.view.html',
      requiresLogin: true,
      action: 'search_roles'
    }).state('editRole', {
      url: '/roles/:roleId/edit',
      templateUrl: 'modules/roles/views/edit-role.client.view.html',
      requiresLogin: true,
      action: 'edit_role'
    }).state('viewRole', {
      url: '/roles/:roleId',
      templateUrl: 'modules/roles/views/view-role.client.view.html',
      requiresLogin: true,
      action: 'view_role'
    });
  }
]);'use strict';
// Roles controller
angular.module('roles').controller('RolesController', [
  '$scope',
  '$stateParams',
  '$location',
  'Authentication',
  'Roles',
  'Module',
  'Action',
  'lodash',
  'Logger',
  function ($scope, $stateParams, $location, Authentication, Roles, Module, Action, lodash, Logger) {
    /**
         * Init variables
         */
    $scope.authentication = Authentication;
    $scope._ = lodash;
    $scope.modules = $scope.modules || Module.query();
    $scope.all_actions = $scope.all_actions || Action.query();
    $scope.selected_module = $scope.selected_module || null;
    $scope.actions = $scope.actions || [];
    $scope.role_actions = $scope.role_actions || [];
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
    $scope.toggleModuleSelection = function toggleSelection(module) {
      $scope.selected_module = module;
      $scope.actions = lodash.where($scope.all_actions, { _module: module._id });
    };
    $scope.toggleActionSelection = function toggleSelection(action) {
      var exists = lodash.contains($scope.role_actions, action);
      if (exists) {
        lodash.remove($scope.role_actions, action);
      } else {
        $scope.role_actions.push(action);
      }
    };
    // Create new Role
    $scope.create = function () {
      // Create new Role object
      var role = new Roles({
          name: this.name,
          _actions: this.role_actions
        });
      // Redirect after save
      role.$save(function (response) {
        $location.path('roles/' + response._id);
        ///log success message
        Logger.success('Role created successfully', true);
        /// Clear form fields
        $scope.name = '';
        $scope.selected_module = null;
        $scope.actions = [];
        $scope.role_actions = [];
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
      var role = $scope.role;
      role._actions = $scope.role_actions;
      role.$update(function () {
        $location.path('roles/' + role._id);
        ///log success message
        Logger.success('Role updated successfully', true);
      }, function (errorResponse) {
        ///log error message
        Logger.error(errorResponse.data.message, true);  //$scope.error = errorResponse.data.message;
      });
    };
    // Find a list of Roles
    $scope.find = function () {
      $scope.roles = Roles.query();
    };
    // Find existing Role
    $scope.findOne = function () {
      $scope.role = Roles.get({ roleId: $stateParams.roleId }, function () {
        $scope.role_actions = lodash.findByValues($scope.all_actions, '_id', $scope.role._actions);
      });
    };
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
  function ($rootScope, Authentication, $location, lodash) {
    //console.log($rootScope.authentication.user);
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
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