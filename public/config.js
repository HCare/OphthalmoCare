'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
    //console.log('config');
	// Init module configuration options
	var applicationModuleName = 'ophthalmocare';
	var applicationModuleVendorDependencies = ['ngResource', 'ngCookies',  'ngAnimate',  'ngTouch',  'ngSanitize',  'ui.router', 'ui.bootstrap', 'ui.utils', 'ngLodash', 'angular-loading-bar', 'toaster', 'webcam', 'akoenig.deckgrid', 'ngImgCrop', 'angularMoment', 'ngFileUpload', 'pascalprecht.translate', 'ui.select', 'schemaForm'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
        //console.log('register module : '+moduleName);
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();

