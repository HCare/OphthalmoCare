'use strict';

// Configuring the Articles module
angular.module('manage-users').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Users', 'manage-users', 'dropdown', '/manage-users(/create)?', false, 1);
		Menus.addSubMenuItem('topbar', 'manage-users', 'List users', 'manage-users', '/manage-users', false, 'list_users', 0);
		Menus.addSubMenuItem('topbar', 'manage-users', 'New user', 'manage-users/create', '/manage-users/create', false, 'create_user', 1);
        Menus.addSubMenuItem('topbar', 'manage-users', 'Search users', 'manage-users/search', '/manage-users/search', false, 'list_users', 2);
	}
]);
