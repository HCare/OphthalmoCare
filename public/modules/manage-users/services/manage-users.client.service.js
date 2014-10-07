'use strict';

//Manage users service used to communicate Manage users REST endpoints
angular.module('manage-users').factory('ManageUsers', ['$resource',
	function($resource) {
		return $resource('manage-users/:manageUserId', { manageUserId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);