'use strict';

// Configuring the Articles module
angular.module('roles').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Roles', 'roles', 'dropdown', '/roles(/create)?', false, 0);
		Menus.addSubMenuItem('topbar', 'roles', 'List Roles', 'roles', '/roles', false, 'list_roles', 0);
		Menus.addSubMenuItem('topbar', 'roles', 'New Role', 'roles/create', '/roles/create', false, 'create_role', 1);
	}
]);