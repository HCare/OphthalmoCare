'use strict';

// Medical histories controller
angular.module('medical-histories').controller('MedicalHistoriesController', ['$scope', '$stateParams', '$location', 'Authentication', 'MedicalHistories',
	function($scope, $stateParams, $location, Authentication, MedicalHistories ) {
		$scope.authentication = Authentication;

		// Create new Medical history
		$scope.create = function() {
			// Create new Medical history object
			var medicalHistory = new MedicalHistories ({
				name: this.name
			});

			// Redirect after save
			medicalHistory.$save(function(response) {
				$location.path('medical-histories/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Medical history
		$scope.remove = function( medicalHistory ) {
			if ( medicalHistory ) { medicalHistory.$remove();

				for (var i in $scope.medicalHistories ) {
					if ($scope.medicalHistories [i] === medicalHistory ) {
						$scope.medicalHistories.splice(i, 1);
					}
				}
			} else {
				$scope.medicalHistory.$remove(function() {
					$location.path('medical-histories');
				});
			}
		};

		// Update existing Medical history
		$scope.update = function() {
			var medicalHistory = $scope.medicalHistory ;

			medicalHistory.$update(function() {
				$location.path('medical-histories/' + medicalHistory._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Medical histories
		$scope.find = function() {
			$scope.medicalHistories = MedicalHistories.query();
		};

		// Find existing Medical history
		$scope.findOne = function() {
			$scope.medicalHistory = MedicalHistories.get({ 
				medicalHistoryId: $stateParams.medicalHistoryId
			});
		};
	}
]);