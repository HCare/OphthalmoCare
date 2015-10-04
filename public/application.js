'use strict';

//Start by defining the main module and adding the module dependencies
/*angular.module('security', []*//*, function(){console.log('first')}*//*);
angular.module('security').provider('auth',
    function () {
        console.log('register security provider');
        var _string = '';

        var config = function configFn(str) {
            console.log(str);
            auth.authorize();
            console.log(str);
            _string = str;
        };

        var auth=function authFn($q, $timeout, $resource, $location){
            return{
                authorize:function () {
                    //alert('call');
                    console.log('authorize');
                    console.log($q);
                    var deferred = $q.defer();
                    console.log('sssssssss');
                    // Make an AJAX call to check if the user is logged in
                    $resource('/auth/is-authorized/list_roles').get().$promise.then(function (response) {
                        console.log('success');
                        //alert('success');
                        console.log(JSON.stringify(response));
                        //alert(JSON.stringify(response));
                        deferred.resolve();
                    }, function (errorResponse) {
                        ///log error message
                        console.log('error');
                        //alert('error');
                        //alert(JSON.stringify(errorResponse));
                        console.log(JSON.stringify(errorResponse));
                        deferred.reject();
                        $location.url('/');
                        //$scope.error = errorResponse.data.message;
                    });
                }
            }
        };
        return{
            $get:auth,
            config: config
        };


    });*/
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies/*, function(){console.log('apppppppp')}*/).run([
    'bootstrap3ElementModifier',
    function (bootstrap3ElementModifier) {
        bootstrap3ElementModifier.enableValidationStateIcons(true);
    }]);


// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
        //console.log('config app module');
		$locationProvider.hashPrefix('!');
	}
]);


//Then define the init function for starting up the application
angular.element(document).ready(function() {
    //console.log('ready');
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});