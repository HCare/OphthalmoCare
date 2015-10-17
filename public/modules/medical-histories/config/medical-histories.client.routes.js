'use strict';

//Setting up route
angular.module('medical-histories').config(['$stateProvider',
	function($stateProvider) {
		// Medical histories state routing
		$stateProvider.
		state('listMedicalHistories', {
			url: '/medical-histories',
			templateUrl: 'modules/medical-histories/views/list-medical-histories.client.view.html'
		}).
		state('createMedicalHistory', {
			url: '/medical-histories/create',
			templateUrl: 'modules/medical-histories/views/create-medical-history.client.view.html'
		}).
		state('viewMedicalHistory', {
			url: '/medical-histories/:medicalHistoryId',
			templateUrl: 'modules/medical-histories/views/view-medical-history.client.view.html'
		}).
		state('editMedicalHistory', {
			url: '/medical-histories/:medicalHistoryId/edit',
			templateUrl: 'modules/medical-histories/views/edit-medical-history.client.view.html'
		});
	}
]);