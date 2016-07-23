'use strict';

//Setting up route
angular.module('manage-users').config(['$stateProvider',
    function ($stateProvider) {
        // Manage users state routing
        $stateProvider.
            state('listManageUsers', {
                url: '/manage-users',
                templateUrl: 'modules/manage-users/views/list-manage-users.client.view.html',
                requiresLogin: true,
                action: 'list_users',
                title: 'Users'
            }).
            state('createManageUser', {
                url: '/manage-users/create',
                templateUrl: 'modules/manage-users/views/create-manage-user.client.view.html',
                requiresLogin: true,
                action: 'create_user',
                title: 'New user'
            }).
            state('searchManageUser', {
                url: '/manage-users/search',
                templateUrl: 'modules/manage-users/views/search-manage-users.client.view.html',
                requiresLogin: true,
                action: 'list_users',
                title: 'Search Users'
            }).
            state('viewManageUser', {
                url: '/manage-users/:manageUserId',
                templateUrl: 'modules/manage-users/views/view-manage-user.client.view.html',
                requiresLogin: true,
                action: 'view_user',
                title: 'View User'
            }).
            state('editManageUser', {
                url: '/manage-users/:manageUserId/edit',
                templateUrl: 'modules/manage-users/views/edit-manage-user.client.view.html',
                requiresLogin: true,
                action: 'edit_user',
                title: 'Edit User'
            });
    }
]);
