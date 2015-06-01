'use strict';

// Roles controller
angular.module('roles').controller('RolesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Roles', 'Module', 'Action', 'lodash', 'Logger','ActionsHandler', 'Toolbar',
    function ($scope, $stateParams, $location, Authentication, Roles, Module, Action, lodash, Logger, ActionsHandler, Toolbar) {
        /**
         * Init variables
         */
        $scope.authentication = Authentication;
        $scope._ = lodash;
        var _modules = $scope.modules || Module.query(function () {
            $scope.modules = _modules
        });
        $scope.selected_modules = [];
        var _all_actions = $scope.all_actions || Action.query(function () {
            $scope.all_actions = _all_actions;
        });
        $scope.selected_module = $scope.selected_module || null;
        $scope.selected_action = $scope.selected_action || null;
        $scope.actions = $scope.actions || [];
        /*$scope.role_actions = $scope.role_actions || [];*/
        $scope.role_actions = [];

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

        $scope.$watch('selected_module', function (value) {
            if ($scope.selected_module) {
                $scope.actions = lodash.where($scope.all_actions, {'_module': $scope.selected_module._id});
            }

        },true);
        $scope.$watch('role_actions', function (value) {
            $scope.selected_modules = [];
            //console.log('b4'+$scope.selected_modules);
            if($scope.role_actions) {

                for(var i=0; i<$scope.role_actions.length; i++) {
                    var actionModule = lodash.where($scope.modules, {'_id': $scope.role_actions[i]._module});
                    if(!lodash.contains($scope.selected_modules,actionModule[0]))
                        $scope.selected_modules.push(actionModule[0]);
                }
                //console.log('after'+$scope.selected_modules);
            }
        },true);


        $scope.filterModuleActions = function callbackfn(value, index, array) {
            if (array && $scope.selected_module) {
                if (array[index]._module == $scope.selected_module._id)
                    return true;
            }
            return false;
        }
        /* $scope.toggleModuleSelection = function toggleSelection(module) {
         console.log('Outside scope');
         $scope.selected_module=module;
         $scope.actions=lodash.where($scope.all_actions, {_module:module._id});
         };*/

       /* $scope.toggleActionSelection = function toggleSelection(action) {

            var exists = lodash.contains($scope.role_actions, action);
            if (exists) {
                lodash.remove($scope.role_actions, action);
            }
            else {
                $scope.role_actions.push(action);
            }
        };*/

        // Create new Role
        $scope.create = function () {
            // Create new Role object
            var role = new Roles({
                name: this.name,
                _actions: this.role_actions
            });
            // Redirect after save
            role.$save(function (response){
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
                Logger.error(errorResponse.data.message, true);
                //$scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Role
        $scope.remove = function (role) {
            if (role) {
                role.$remove(function () {
                        for (var i in $scope.roles) {
                            if ($scope.roles [i] === role) {
                                $scope.roles.splice(i, 1);
                            }
                        }
                        ///log success message
                        Logger.success('Role deleted successfully', true);
                    }, function (errorResponse) {
                        ///log error message
                        Logger.error(errorResponse.data.message, true);
                        //$scope.error = errorResponse.data.message;
                    }
                );
            } else {
                $scope.role.$remove(function () {
                    ///log success message
                    Logger.success('Role deleted successfully', true);
                    $location.path('roles');
                }, function (errorResponse) {
                    ///log error message
                    Logger.error(errorResponse.data.message, true);
                    //$scope.error = errorResponse.data.message;
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
                Logger.error(errorResponse.data.message, true);
                //$scope.error = errorResponse.data.message;
            });
        };

        // Search existing Roles
        $scope.search = function () {
            if((!$scope.name || $scope.name == '' || $scope.name == undefined) && (!$scope.role_actions || $scope.role_actions.length == 0))
            {
                Logger.error("Please Enter Search Criteria", true);
            }
            else
            {
                var searchCriteria = {name:$scope.name,_actions:$scope.role_actions};
                Roles.query(searchCriteria, function(_roles){
                    $scope.roles =_roles;
                });
            }

        };

        // Find a list of Roles
        $scope.find = function () {
            Roles.query(function(_roles){
                $scope.roles =_roles;
            });

        };

        // Find existing Role
        $scope.findOne = function (callback) {

            var role = Roles.get({
                roleId: $stateParams.roleId
            }, function () {
                $scope.role = role;

                $scope.role_actions = lodash.findByValues($scope.all_actions, '_id', $scope.role._actions);

                for (var i = 0; i < $scope.modules.length; i++) {
                    if(lodash.where($scope.role_actions,{'_module':$scope.modules[i]._id}).length >0) {
                        $scope.selected_module = $scope.modules[i];
                        break;
                    }
                }
                if(callback){
                    callback();
                }
            });
        };

        $scope.initCreate=function(){
            Toolbar.addToolbarCommand('saveRole', 'create_role', 'Save', 'floppy-save', 0);
        };

        $scope.initEdit=function(){
            $scope.findOne(function(){
                Toolbar.addToolbarCommand('updateRole', 'edit_role', 'Save', 'floppy-save', 0);
            });
        };

        $scope.initView=function(){
            $scope.findOne(function(){
                Toolbar.addToolbarCommand('editRole', 'edit_role', 'Edit', 'edit', 1);
                Toolbar.addToolbarCommand('deleteRole', 'delete_role', 'Delete', 'trash', 2, null, 'Are you sure to delete role "'+$scope.role.name+'"?');
            });
        };

        $scope.initSearch = function () {
            Toolbar.addToolbarCommand('searchRole', 'search_roles', 'Search', 'search', 0);
        };

        ActionsHandler.onActionFired('saveRole', $scope, function (action, args) {
            $scope.create();
        });

        ActionsHandler.onActionFired('updateRole', $scope, function (action, args) {
            $scope.update();
        });

        ActionsHandler.onActionFired('editRole', $scope, function (action, args) {
            $location.path('roles/'+$scope.role._id+'/edit');
        });

        ActionsHandler.onActionFired('deleteRole', $scope, function (action, args) {
            $scope.remove();
        });

        ActionsHandler.onActionFired('searchRole', $scope, function (action, args) {
            $scope.search();
        });
    }
]);
