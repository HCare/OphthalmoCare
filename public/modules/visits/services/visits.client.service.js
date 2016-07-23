'use strict';

//Visits service used to communicate Visits REST endpoints
angular.module('visits').factory('Visits', ['$resource',
	function($resource) {
		return $resource('visits/:visitId', { visitId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);