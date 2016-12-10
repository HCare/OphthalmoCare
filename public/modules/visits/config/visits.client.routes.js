'use strict';

//Setting up route
angular.module('visits').config(['$stateProvider',
    function ($stateProvider) {
        // Visits state routing
        $stateProvider.
            state('listVisits', {
                url: '/visits',
                templateUrl: 'modules/visits/views/list-visits.client.view.html',
                requiresLogin: true,
                action: 'list_visits',
                title: 'Visits'
            }).
            state('createVisit', {
                url: '/visits/create/:patientId',
                templateUrl: 'modules/visits/views/create-visit.client.view.html',
                requiresLogin: true,
                action: 'create_visit',
                title: 'New Visit'
            }).
            state('viewVisit', {
                url: '/visits/:visitId',
                templateUrl: 'modules/visits/views/view-visit.client.view.html',
                requiresLogin: true,
                action: 'view_visit',
                title: 'View Visit'
            }).
            state('editVisit', {
                url: '/visits/:visitId/edit',
                templateUrl: 'modules/visits/views/edit-visit.client.view.html',
                requiresLogin: true,
                action: 'edit_visit',
                title: 'Edit Visit'
            });
    }
]);
