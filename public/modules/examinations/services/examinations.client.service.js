'use strict';

//Examinations service used to communicate Examinations REST endpoints
angular.module('examinations').factory('Examinations', ['$resource',
	function($resource) {
		return $resource('examinations/:examinationId', { examinationId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);