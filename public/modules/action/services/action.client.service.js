'use strict';

angular.module('action').factory('Action', ['$resource',
	function($resource) {
		// Action service logic
		// ...

		// Public API
        return $resource('action/list');
	}
]);