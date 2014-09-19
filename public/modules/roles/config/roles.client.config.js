'use strict';

// Configuring the Articles module
angular.module('roles').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Roles', 'roles', 'dropdown', '/roles(/create)?');
		Menus.addSubMenuItem('topbar', 'roles', 'List Roles', 'roles');
		Menus.addSubMenuItem('topbar', 'roles', 'New Role', 'roles/create');
	}
]);