'use strict';

// Configuring the Articles module
angular.module('patients').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Patients', 'patients', 'dropdown', '/patients(/create)?', false, 2);
		Menus.addSubMenuItem('topbar', 'patients', 'List Patients', 'patients', '/patients', false, 'list_patients', 0);
		Menus.addSubMenuItem('topbar', 'patients', 'New Patient', 'patients/create', '/patients/create', false, 'create_patient', 1);
	}
]);