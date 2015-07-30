'use strict';

//Setting up route
angular.module('examinations').config(['$stateProvider',
    function ($stateProvider) {
        // Examinations state routing
        $stateProvider.
            state('listExaminations', {
                url: '/examinations',
                templateUrl: 'modules/examinations/views/list-examinations.client.view.html',
                action: 'list_examinations',
                title: 'Examinations'
            }).
            state('patientExaminations', {
                url: '/examinations/patient/:patientId',
                templateUrl: 'modules/examinations/views/patient-examinations.client.view.html',
                action: 'list_examinations',
                title: 'Patient Examinations'
            }).
            state('searchExaminations', {
                url: '/examinations/search',
                templateUrl: 'modules/examinations/views/search-examinations.client.view.html',
                action: 'list_examinations',
                title: 'Search Examinations'
            }).
            state('createExamination', {
                url: '/examinations/create/:patientId',
                templateUrl: 'modules/examinations/views/create-examination.client.view.html',
                action: 'create_examination',
                title: 'New Examination'
            }).
            state('viewExamination', {
                url: '/examinations/:examinationId',
                templateUrl: 'modules/examinations/views/view-examination.client.view.html',
                action: 'view_examination',
                title: 'View Examination'
            }).
            state('viewPatientExamination', {
                url: '/examinations/view/:examinationId',
                templateUrl: 'modules/examinations/views/view-examination.client.view.html',
                action: 'view_examination',
                title: 'View Examination'
            }).
            state('editPatientExamination', {
                url: '/examinations/edit/:examinationId/edit',
                templateUrl: 'modules/examinations/views/edit-examination.client.view.html',
                action: 'edit_examination',
                title: 'Edit Examinations'
            }).
            state('editExamination', {
                url: '/examinations/:examinationId/edit',
                templateUrl: 'modules/examinations/views/edit-examination.client.view.html',
                action: 'edit_examination',
                title: 'Edit Examinations'
            });
    }
]);
