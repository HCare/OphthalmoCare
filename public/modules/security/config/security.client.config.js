'use strict';

// Configuring the Articles module
angular.module('security').run(['$rootScope', 'Authentication', '$location', 'lodash','Core',
	function($rootScope, Authentication, $location, lodash, Core) {

        //console.log($rootScope.authentication.user);
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            Core.setPageSubTitle(null);
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