'use strict';

// Visits controller
angular.module('visits').controller('VisitsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Visits',
	function($scope, $stateParams, $location, Authentication, Visits ) {
		$scope.authentication = Authentication;

		// Create new Visit
		$scope.create = function() {
			// Create new Visit object
			var visit = new Visits ({
				name: this.name
			});

			// Redirect after save
			visit.$save(function(response) {
				$location.path('visits/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Visit
		$scope.remove = function( visit ) {
			if ( visit ) { visit.$remove();

				for (var i in $scope.visits ) {
					if ($scope.visits [i] === visit ) {
						$scope.visits.splice(i, 1);
					}
				}
			} else {
				$scope.visit.$remove(function() {
					$location.path('visits');
				});
			}
		};

		// Update existing Visit
		$scope.update = function() {
			var visit = $scope.visit ;

			visit.$update(function() {
				$location.path('visits/' + visit._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Visits
		$scope.find = function() {
			$scope.visits = Visits.query();
		};

		// Find existing Visit
		$scope.findOne = function() {
			$scope.visit = Visits.get({ 
				visitId: $stateParams.visitId
			});
		};
	}
]);