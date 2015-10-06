'use strict';

// Configuring the Articles module
angular.module('security').run(['$rootScope', 'Authentication', '$location', 'lodash','CoreProperties','Toolbar','bootstrap3ElementModifier',
	function($rootScope, Authentication, $location, lodash, CoreProperties, Toolbar, bootstrap3ElementModifier) {

        bootstrap3ElementModifier.enableValidationStateIcons(true);
        //console.log($rootScope.authentication.user);
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            CoreProperties.setPageSubTitle(null);
            Toolbar.clearToolbarCommands();
            if(toState.requiresLogin){
                if(lodash.isEmpty(Authentication.user) || !Authentication.user){
                    event.preventDefault();
                    $location.path('/signin');
                    return;
                }
                if(toState.action){

                    if(!lodash.contains(Authentication.user._role._actions, toState.action)){
                        event.preventDefault();
                        $location.path('/not-authorized');
                    }
                }
            }
        });
	}
]);
