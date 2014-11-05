'use strict';

// Configuring the Articles module
angular.module('examinations').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Examinations', 'examinations', 'dropdown', '/examinations(/create)?', false, 3);
		Menus.addSubMenuItem('topbar', 'examinations', 'List Examinations', 'examinations', '/examinations', false, 'list_examinations', 0);
		Menus.addSubMenuItem('topbar', 'examinations', 'New Examination', 'examinations/create', '/examinations/create', false, 'create_examination', 1);
	}
]);