'use strict';

//Setting up route
angular.module('complaints').config(['$stateProvider',
	function($stateProvider) {
		// Complaints state routing
		$stateProvider.
		state('listComplaints', {
			url: '/complaints',
			templateUrl: 'modules/complaints/views/list-complaints.client.view.html'
		}).
		state('createComplaint', {
			url: '/complaints/create',
			templateUrl: 'modules/complaints/views/create-complaint.client.view.html'
		}).
		state('viewComplaint', {
			url: '/complaints/:complaintId',
			templateUrl: 'modules/complaints/views/view-complaint.client.view.html'
		}).
		state('editComplaint', {
			url: '/complaints/:complaintId/edit',
			templateUrl: 'modules/complaints/views/edit-complaint.client.view.html'
		});
	}
]);