'use strict';

// Configuring the Articles module
angular.module('complaints').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Complaints', 'complaints', 'dropdown', '/complaints(/create)?');
		Menus.addSubMenuItem('topbar', 'complaints', 'List Complaints', 'complaints');
		Menus.addSubMenuItem('topbar', 'complaints', 'New Complaint', 'complaints/create');
	}
]);