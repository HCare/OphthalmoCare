'use strict';

//Setting up route
angular.module('visits').config(['$stateProvider',
	function($stateProvider) {
		// Visits state routing
		$stateProvider.
		state('listVisits', {
			url: '/visits',
			templateUrl: 'modules/visits/views/list-visits.client.view.html'
		}).
		state('createVisit', {
			url: '/visits/create',
			templateUrl: 'modules/visits/views/create-visit.client.view.html'
		}).
		state('viewVisit', {
			url: '/visits/:visitId',
			templateUrl: 'modules/visits/views/view-visit.client.view.html'
		}).
		state('editVisit', {
			url: '/visits/:visitId/edit',
			templateUrl: 'modules/visits/views/edit-visit.client.view.html'
		});
	}
]);