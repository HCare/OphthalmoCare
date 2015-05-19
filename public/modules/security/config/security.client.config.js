'use strict';

// Configuring the Articles module
angular.module('security').run(['$rootScope', 'Authentication', '$location', 'lodash','CoreProperties','Toolbar',
	function($rootScope, Authentication, $location, lodash, CoreProperties, Toolbar) {

        //console.log($rootScope.authentication.user);
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            CoreProperties.setPageSubTitle(null);
            Toolbar.clearToolbarCommands();
            if(toState.requiresLogin){
                if(!Authentication.user){
                    $location.path('/signin');
                    return;
                }
                if(toState.action){
                    if(!lodash.contains(Authentication.user._role._actions, toState.action)){
                        $location.path('/not-authorized');
                    }
                }
            }
        });
	}
]);
