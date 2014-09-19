'use strict';

//Setting up route
angular.module('roles').config(['$stateProvider',
	function($stateProvider) {
		// Roles state routing
		$stateProvider.
		state('listRoles', {
			url: '/roles',
			templateUrl: 'modules/roles/views/list-roles.client.view.html'
		}).
		state('createRole', {
			url: '/roles/create',
			templateUrl: 'modules/roles/views/create-role.client.view.html'
		}).
		state('viewRole', {
			url: '/roles/:roleId',
			templateUrl: 'modules/roles/views/view-role.client.view.html'
		}).
		state('editRole', {
			url: '/roles/:roleId/edit',
			templateUrl: 'modules/roles/views/edit-role.client.view.html'
		});
	}
]);