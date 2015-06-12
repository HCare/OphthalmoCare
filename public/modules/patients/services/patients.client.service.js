'use strict';

//Patients service used to communicate Patients REST endpoints
angular.module('patients').factory('Patients', ['$resource',
	function($resource) {
		return $resource('patients/:patientId', { patientId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},

          query:{
              isArray:false
          }
        /*,
            search:{
                method: 'GET',
                url:'patients/search'
            }*/
		});
	}
]);

/*
angular.module('patients').factory('Patient',function(){
    var currentPatient = null;

    var setCurrentPatient = function(patient) {
        currentPatient=patient;
    };

    var getCurrentPatient = function(){
        return currentPatient;
    };

    return {
        setCurrentPatient: setCurrentPatient,
        getCurrentPatient: getCurrentPatient
    };
});*/
