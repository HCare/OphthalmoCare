'use strict';

// Manage users controller
angular.module('manage-users')
    .controller('ManageUsersController', ['$scope', '$stateParams', '$location', 'Authentication', 'ManageUsers', 'Roles', 'lodash', 'Logger', 'ActionsHandler', 'Toolbar',
        function ($scope, $stateParams, $location, Authentication, ManageUsers, Roles, lodash, Logger, ActionsHandler, Toolbar) {
            //region Init variables

            $scope.authentication = Authentication;
            $scope._ = lodash;
            $scope.roles = Roles.query();

            $scope.selected_role = $scope.selected_role || null;
            $scope.selected_roles = $scope.selected_roles || [];

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
                $scope.manageUser._role = role_id;
            };

            // Init New Managed User
            $scope.initOne = function () {
                $scope.manageUser = new ManageUsers({password: Math.random().toString(36).slice(-8)});
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
                    Logger.error(errorResponse.data.message, true);
                    //$scope.error = errorResponse.data.message;
                });
            };

            // Remove existing Managed user
            $scope.remove = function (manageUser) {
                if (manageUser) {
                    manageUser.$remove(function () {
                        for (var i in $scope.manageUsers) {
                            if ($scope.manageUsers [i] === manageUser) {
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
                    Logger.error(errorResponse.data.message, true);
                    //$scope.error = errorResponse.data.message;
                });
            };

            // Find a list of Managed users
            $scope.find = function () {
                $scope.manageUsers = ManageUsers.query();
            };

            // Find existing Manage user
            $scope.findOne = function (callback) {
                ManageUsers.get({
                    manageUserId: $stateParams.manageUserId
                }, function (_user) {
                    $scope.manageUser = _user;
                    if (_user._role) {
                        $scope.selected_roles.push(_user._role);
                    }

                    if (callback) {
                        callback();
                    }
                });
            };

            // Search existing Users
            $scope.search = function () {
                if ((!$scope.manageUser.fullName || $scope.manageUser.fullName == '' || $scope.manageUser.fullName == undefined) && (!$scope.manageUser.displayName || $scope.manageUser.displayName == '' || $scope.manageUser.displayName == undefined) && (!$scope.manageUser.email || $scope.manageUser.email == '' || $scope.manageUser.email == undefined) && (!$scope.manageUser._role || $scope.manageUser._role == '' || $scope.manageUser._role == undefined)) {
                    Logger.error("Please Enter Search Criteria", true);
                    $scope.manageUsers = [];
                }
                else {
                    ManageUsers.query($scope.manageUser, function (_users) {
                        $scope.manageUsers = _users;
                    });
                }
            };

            //endregion CRUD functions

            $scope.$watch('selected_role', function (value) {
                if ($scope.manageUser) {
                    if (value) {

                        $scope.manageUser._role = value._id;

                    }
                    else {
                        $scope.manageUser._role = value; // null
                    }
                }
            }, true);

            $scope.initCreate = function () {
                $scope.initOne();
                Toolbar.addToolbarCommand('saveUser', 'create_user', 'Save', 'floppy-save', 0);
            };

            $scope.initEdit = function () {
                $scope.findOne(function () {
                    Toolbar.addToolbarCommand('updateUser', 'edit_user', 'Save', 'floppy-save', 0);
                });
            };

            $scope.initView = function () {
                $scope.findOne(function () {
                    Toolbar.addToolbarCommand('editUser', 'edit_user', 'Edit', 'edit', 1);
                    Toolbar.addToolbarCommand('deleteUser', 'delete_user', 'Delete', 'trash', 2, null, 'Are you sure to delete user "' + $scope.manageUser.email + '"?');
                });
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

        }
    ]);
