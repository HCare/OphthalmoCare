'use strict';

//Patients service used to communicate Patients REST endpoints
angular.module('patients').factory('Patients', ['$resource',
	function($resource) {
		return $resource('patients/:patientId', { patientId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);