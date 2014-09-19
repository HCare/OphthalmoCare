'use strict';

angular.module('module').factory('Module', ['$resource',
	function($resource) {
		// Module service logic
		// ...

		// Public API
		return $resource('module/list');
	}
]);