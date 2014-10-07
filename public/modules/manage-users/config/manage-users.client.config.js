'use strict';

// Configuring the Articles module
angular.module('manage-users').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Users', 'manage-users', 'dropdown', '/manage-users(/create)?');
		Menus.addSubMenuItem('topbar', 'manage-users', 'List users', 'manage-users');
		Menus.addSubMenuItem('topbar', 'manage-users', 'New user', 'manage-users/create');
	}
]);