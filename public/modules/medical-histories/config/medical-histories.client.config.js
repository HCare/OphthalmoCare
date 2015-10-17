'use strict';

// Configuring the Articles module
angular.module('medical-histories').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Medical histories', 'medical-histories', 'dropdown', '/medical-histories(/create)?');
		Menus.addSubMenuItem('topbar', 'medical-histories', 'List Medical histories', 'medical-histories');
		Menus.addSubMenuItem('topbar', 'medical-histories', 'New Medical history', 'medical-histories/create');
	}
]);