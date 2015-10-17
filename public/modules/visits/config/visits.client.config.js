'use strict';

// Configuring the Articles module
angular.module('visits').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Visits', 'visits', 'dropdown', '/visits(/create)?');
		Menus.addSubMenuItem('topbar', 'visits', 'List Visits', 'visits');
		Menus.addSubMenuItem('topbar', 'visits', 'New Visit', 'visits/create');
	}
]);