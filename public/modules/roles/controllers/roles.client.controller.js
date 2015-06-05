'use strict';

// Roles controller
angular.module('roles').controller('RolesController', ['$scope', '$stateParams', '$location', 'Roles', 'Module', 'Action', 'Logger', 'ActionsHandler', 'Toolbar', 'lodash',
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
                $scope.actionsObj.actions = lodash.where($scope.actionsObj.all_actions, {'_module': $scope.actionsObj.selected_module._id});
            }

        }, true);

        $scope.$watch('actionsObj.role_actions', function (value) {
            $scope.actionsObj.selected_modules = [];
            if ($scope.actionsObj.role_actions) {
                for (var i = 0; i < $scope.actionsObj.role_actions.length; i++) {
                    var actionModule = lodash.where($scope.actionsObj.modules, {'_id': $scope.actionsObj.role_actions[i]._module});
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
                if(callback){
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
            var _role = $scope.role;
            role._actions  = $scope.actionsObj.role_actions;
            _role.$update(function () {
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
        $scope.search = function (callback) {
            if ((!$scope.role.name || $scope.role.name == '' || $scope.role.name == undefined) && (!$scope.role._actions || $scope.role._actions.length == 0)) {
                Logger.error("Please Enter Search Criteria", true);
            }
            else {
                //var searchCriteria = {name:$scope.name,_actions:$scope.role._actions};
                Roles.query($scope.role, function (_roles) {
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

            Roles.get({
                roleId: $stateParams.roleId
            }, function (_role) {
                console.log(_role);
                $scope.role = _role;

                $scope.actionsObj.role_actions = lodash.findByValues($scope.actionsObj.all_actions, '_id', $scope.role._actions);

                for (var i = 0; i < $scope.actionsObj.modules.length; i++) {
                    if (lodash.where($scope.role._actions, {'_module': $scope.actionsObj.modules[i]._id}).length > 0) {
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
            $scope.initOne(function(){
                Toolbar.addToolbarCommand('saveRole', 'create_role', 'Save', 'floppy-save', 0);
            });
        };

        $scope.initEdit = function () {
            $scope.initActions(function () {
                $scope.findOne(function () {
                    Toolbar.addToolbarCommand('updateRole', 'edit_role', 'Save', 'floppy-save', 0);
                })
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
            $scope.initOne(function(){
                $scope.tabsConfig = {};
                $scope.tabsConfig.showResuls = false;
                Toolbar.addToolbarCommand('searchRole', 'search_roles', 'Search', 'search', 0);
            });
        };

        $scope.initList = function () {
            $scope.initActions(function () {
                $scope.find()
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
]);
