'use strict';

//Complaints service used to communicate Complaints REST endpoints
angular.module('complaints').factory('Complaints', ['$resource',
	function($resource) {
		return $resource('complaints/:complaintId', { complaintId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);