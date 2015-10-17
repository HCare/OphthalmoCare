'use strict';

//Medical histories service used to communicate Medical histories REST endpoints
angular.module('medical-histories').factory('MedicalHistories', ['$resource',
	function($resource) {
		return $resource('medical-histories/:medicalHistoryId', { medicalHistoryId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);