'use strict';

// Complaints controller
angular.module('complaints').controller('ComplaintsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Complaints',
	function($scope, $stateParams, $location, Authentication, Complaints ) {
		$scope.authentication = Authentication;

		// Create new Complaint
		$scope.create = function() {
			// Create new Complaint object
			var complaint = new Complaints ({
				name: this.name
			});

			// Redirect after save
			complaint.$save(function(response) {
				$location.path('complaints/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Complaint
		$scope.remove = function( complaint ) {
			if ( complaint ) { complaint.$remove();

				for (var i in $scope.complaints ) {
					if ($scope.complaints [i] === complaint ) {
						$scope.complaints.splice(i, 1);
					}
				}
			} else {
				$scope.complaint.$remove(function() {
					$location.path('complaints');
				});
			}
		};

		// Update existing Complaint
		$scope.update = function() {
			var complaint = $scope.complaint ;

			complaint.$update(function() {
				$location.path('complaints/' + complaint._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Complaints
		$scope.find = function() {
			$scope.complaints = Complaints.query();
		};

		// Find existing Complaint
		$scope.findOne = function() {
			$scope.complaint = Complaints.get({ 
				complaintId: $stateParams.complaintId
			});
		};
	}
]);