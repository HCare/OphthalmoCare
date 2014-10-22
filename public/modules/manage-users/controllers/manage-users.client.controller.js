'use strict';

// Manage users controller
angular.module('manage-users')
    .controller('ManageUsersController', ['$scope', '$stateParams', '$location', 'Authentication', 'ManageUsers', 'Roles', 'lodash', 'Logger',
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
            $scope.manageUser._role = role_id;
            //console.log($scope.manageUser._role);
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
        $scope.findOne = function () {
            $scope.manageUser = ManageUsers.get({
                manageUserId: $stateParams.manageUserId
            });
        };


        //endregion CRUD functions
    }
    ]);