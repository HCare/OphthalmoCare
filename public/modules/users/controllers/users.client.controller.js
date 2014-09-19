'use strict';

// Roles controller
angular.module('users').controller('UsersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Users', 'Roles', 'lodash',
	function($scope, $stateParams, $location, Authentication, Users, Roles, lodash ) {
        /**
         * Init variables
         */
            $scope.authentication = Authentication;
            $scope._=lodash;
        $scope.roles=Roles.query();

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

        //select Role
        $scope.toggleRoleSelection=function(role_id){
        $scope.user._role=role_id;
        };

		// Create new User
		$scope.create = function() {
			// Get new User object
			var user =$scope.user;

			// Redirect after save
            user.$save(function(response) {
				$location.path('users/' + response._id);

				// Clear form fields
				$scope.initOne();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing User
		$scope.remove = function( user ) {
			if ( user ) { user.$remove();

				for (var i in $scope.users ) {
					if ($scope.users [i] === user ) {
						$scope.users.splice(i, 1);
					}
				}
			} else {
				$scope.user.$remove(function() {
					$location.path('users');
				});
			}
		};

		// Update existing User
		$scope.update = function() {
			var user = $scope.user ;
			user.$update(function() {
				$location.path('users/' + user._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Users
		$scope.find = function() {
			$scope.users = Users.query();
		};

		// Find existing User
		$scope.findOne = function() {
			$scope.user = Users.get({
				userId: $stateParams.userId
			});
		};

        // Init New User
        $scope.initOne = function() {
            $scope.user = new Users ({password:Math.random().toString(36).slice(-8)});
        };
	}
]);