'use strict';

// Configuring the Articles module
angular.module('examinations').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Examinations', 'examinations', 'dropdown', '/examinations(/create)?', false, 3);
		Menus.addSubMenuItem('topbar', 'examinations', 'List Examinations', 'examinations', '/examinations', false, 'list_examinations', 0);
		Menus.addSubMenuItem('topbar', 'examinations', 'Search Examinations', 'examinations/search', '/examinations/search', false, 'search_examination', 1);
	}
]);
