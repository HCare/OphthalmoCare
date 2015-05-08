'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus', '$state','Core',
    function ($scope, Authentication, Menus, $state, Core) {
        $scope.authentication = Authentication;
        $scope.isCollapsed = false;
        $scope.menu = Menus.getMenu('topbar');
        $scope.pageTitle=$state.current.title||null;
        $scope.showToolBar = ($state.current.url != "/"&& $state.current.url!='/signin');
        $scope.pageSubTitle=function(){
            return Core.getPageSubTitle();
        }

        $scope.toggleCollapsibleMenu = function () {
            $scope.isCollapsed = !$scope.isCollapsed;
        };

        // Collapsing the menu after navigation
        $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            if(toState.title){
                $scope.pageTitle=toState.title;
            }
            $scope.showToolBar = (toState.url != "/"&& toState.url!='/signin');
            $scope.isCollapsed = false;
        });
    }
]);