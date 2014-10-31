'use strict';

// Roles controller
angular.module('roles').controller('RolesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Roles', 'Module', 'Action', 'lodash', 'Logger',
	function($scope, $stateParams, $location, Authentication, Roles, Module, Action, lodash, Logger ) {
        /**
         * Init variables
         */
            $scope.authentication = Authentication;
            $scope._=lodash;
            $scope.modules=$scope.modules||Module.query();
            $scope.all_actions=$scope.all_actions||Action.query();
            $scope.selected_module=$scope.selected_module||null;
            $scope.actions=$scope.actions||[];
            $scope.role_actions=$scope.role_actions||[];

        /**
         * Helper functions
         */
        lodash.mixin({
            'findByValues': function(collection, property, values) {
                return lodash.filter(collection, function(item) {
                    return lodash.contains(values, item[property]);
                });
            }
        });

        lodash.mixin({
            'findByValuesInPath': function(collection, property, values, path) {
                return lodash.filter(collection, function(item) {
                    return lodash.contains(lodash.map(values, path), item[property]);
                });
            }
        });


        $scope.toggleModuleSelection = function toggleSelection(module) {
            $scope.selected_module=module;
            $scope.actions=lodash.where($scope.all_actions, {_module:module._id});
        };

        $scope.toggleActionSelection = function toggleSelection(action) {

            var exists=lodash.contains($scope.role_actions, action);
            if(exists){
                lodash.remove($scope.role_actions, action);
            }
            else{
               $scope.role_actions.push(action);
            }
        };

		// Create new Role
		$scope.create = function() {
			// Create new Role object
			var role = new Roles ({
				name: this.name,
                _actions:this.role_actions
			});

			// Redirect after save
			role.$save(function(response) {
				$location.path('roles/' + response._id);

                ///log success message
                Logger.success('Role created successfully', true);

				/// Clear form fields
				$scope.name = '';
                $scope.selected_module=null;
                $scope.actions=[];
                $scope.role_actions=[];

			}, function(errorResponse) {
                ///log error message
                Logger.error(errorResponse.data.message, true);
                //$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Role
		$scope.remove = function( role ) {
			if ( role ) { role.$remove(function(){
                    for (var i in $scope.roles ) {
                        if ($scope.roles [i] === role ) {
                            $scope.roles.splice(i, 1);
                        }
                    }
                    ///log success message
                    Logger.success('Role deleted successfully', true);
                }, function(errorResponse){
                    ///log error message
                    Logger.error(errorResponse.data.message, true);
                    //$scope.error = errorResponse.data.message;
                }
            );
			} else {
				$scope.role.$remove(function() {
                    ///log success message
                    Logger.success('Role deleted successfully', true);
					$location.path('roles');
				}, function(errorResponse){
                    ///log error message
                    Logger.error(errorResponse.data.message, true);
                    //$scope.error = errorResponse.data.message;
                });
			}
		};

		// Update existing Role
		$scope.update = function() {
			var role = $scope.role ;
            role._actions=$scope.role_actions;
			role.$update(function() {
				$location.path('roles/' + role._id);
                ///log success message
                Logger.success('Role updated successfully', true);
			}, function(errorResponse) {
                ///log error message
                Logger.error(errorResponse.data.message, true);
				//$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Roles
		$scope.find = function() {
			var roles = Roles.query(function(){
                $scope.roles=roles;
            });
		};

		// Find existing Role
		$scope.findOne = function() {
			$scope.role = Roles.get({ 
				roleId: $stateParams.roleId
			}, function(){
                $scope.role_actions=lodash.findByValues($scope.all_actions, '_id', $scope.role._actions);
            });
		};
	}
]);