'use strict';

//Setting up route
angular.module('manage-users').config(['$stateProvider',
	function($stateProvider) {
		// Manage users state routing
		$stateProvider.
		state('listManageUsers', {
			url: '/manage-users',
			templateUrl: 'modules/manage-users/views/list-manage-users.client.view.html',
            action:'list_users',
            title:'List Users'
		}).
		state('createManageUser', {
			url: '/manage-users/create',
			templateUrl: 'modules/manage-users/views/create-manage-user.client.view.html',
            action:'create_user',
            title:'Create User'
		}).
         state('searchManageUser', {
                url: '/manage-users/search',
                templateUrl: 'modules/manage-users/views/search-manage-users.client.view.html',
                action:'search_users',
                title:'Search Users'
         }).
		state('viewManageUser', {
			url: '/manage-users/:manageUserId',
			templateUrl: 'modules/manage-users/views/view-manage-user.client.view.html',
                action:'view_user',
                title:'View User'
		}).
		state('editManageUser', {
			url: '/manage-users/:manageUserId/edit',
			templateUrl: 'modules/manage-users/views/edit-manage-user.client.view.html',
                action:'edit_user',
                title:'Edit User'
		});
	}
]);