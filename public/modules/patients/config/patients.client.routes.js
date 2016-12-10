'use strict';

//Setting up route
angular.module('patients').config(['$stateProvider',
    function ($stateProvider) {
        // Patients state routing
        $stateProvider.
            state('listPatients', {
                url: '/patients',
                templateUrl: 'modules/patients/views/list-patients.client.view.html',
                requiresLogin: true,
                action: 'list_patients',
                title:'Patients'
            }).
            state('createPatient', {
                url: '/patients/create',
                templateUrl: 'modules/patients/views/create-patient.client.view.html',
                requiresLogin: true,
                action: 'create_patient',
                title:'New Patient'
            }).
            state('searchPatients', {
                url: '/patients/search',
                templateUrl: 'modules/patients/views/search-patients.client.view.html',
                requiresLogin: true,
                action: 'list_patients',
                title:'Search Patients'
            }).
            state('viewPatient', {
                url: '/patients/:patientId',
                templateUrl: 'modules/patients/views/view-patient.client.view.html',
                requiresLogin: true,
                action: 'view_patient',
                title:'View Patient'
            }).
            state('editPatient', {
                url: '/patients/:patientId/edit',
                templateUrl: 'modules/patients/views/edit-patient.client.view.html',
                requiresLogin: true,
                action: 'edit_patient',
                title:'Edit Patient'
            });
    }
]);
