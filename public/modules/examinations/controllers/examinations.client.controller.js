'use strict';

// Examinations controller
angular.module('examinations').controller('ExaminationsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Examinations',
	function($scope, $stateParams, $location, Authentication, Examinations ) {
		$scope.authentication = Authentication;

		// Create new Examination
		$scope.create = function() {
			// Create new Examination object
			var examination = new Examinations ({
				name: this.name
			});

			// Redirect after save
			examination.$save(function(response) {
				$location.path('examinations/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Examination
		$scope.remove = function( examination ) {
			if ( examination ) { examination.$remove();

				for (var i in $scope.examinations ) {
					if ($scope.examinations [i] === examination ) {
						$scope.examinations.splice(i, 1);
					}
				}
			} else {
				$scope.examination.$remove(function() {
					$location.path('examinations');
				});
			}
		};

		// Update existing Examination
		$scope.update = function() {
			var examination = $scope.examination ;

			examination.$update(function() {
				$location.path('examinations/' + examination._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Examinations
		$scope.find = function() {
			$scope.examinations = Examinations.query();
		};

		// Find existing Examination
		$scope.findOne = function() {
			$scope.examination = Examinations.get({ 
				examinationId: $stateParams.examinationId
			});
		};
	}
]);