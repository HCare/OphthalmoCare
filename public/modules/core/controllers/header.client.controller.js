'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus', '$state', 'CoreProperties', 'ActionsHandler', 'Toolbar', '$aside','$rootScope',
    function ($scope, Authentication, Menus, $state, CoreProperties, ActionsHandler, Toolbar, $aside, $rootScope) {
        $scope.authentication = Authentication;
        $scope.isCollapsed = false;
        $scope.menu = Menus.getMenu('topbar');
        $scope.toolbarCommands=function(){
            return Toolbar.getToolbarCommands();
        };
        $scope.pageTitle=$state.current.title||null;
        $scope.showToolBar = ($state.current.url != "/"&& $state.current.url!='/signin');
        $scope.pageSubTitle=function(){
            return CoreProperties.getPageSubTitle();
        };

        $scope.toggleCollapsibleMenu = function () {
            $scope.isCollapsed = !$scope.isCollapsed;
        };



        // Collapsing the menu after navigation
        $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            $scope.closeAside();
            if(toState.title){
                $scope.pageTitle=toState.title;
            }
            $scope.showToolBar = (toState.url != "/"&& toState.url!='/signin');
            $scope.isCollapsed = false;
        });

        $scope.fireCommand=function(command){
            ActionsHandler.fireAction(command, null);
        };

        $rootScope.asideState={open:false};

        $scope.closeAside = function() {
            if($scope.asideInstance) {
                $scope.asideInstance.close();
            }
        };

        $scope.openAside = function(template, position, slideOver) {
            $rootScope.asideState = {
                open: true,
                position: position
            };
            $scope.postClose=function () {
                $rootScope.asideState.open = false;
            };
            $aside.open({
                templateUrl: template,
                placement: position,
                backdrop: slideOver,
                controller: function($scope, $modalInstance, Authentication, Menus) {
                    $scope.$parent.asideInstance=$modalInstance;
                    $scope.ok = function(e) {
                        $modalInstance.close();
                        e.stopPropagation();
                    };
                    $scope.cancel = function(e) {
                        $modalInstance.dismiss();
                        e.stopPropagation();
                    };

                    $scope.authentication = Authentication;
                    $scope.isCollapsed = false;
                    $scope.menu = Menus.getMenu('topbar');
                    $scope.toggleCollapsibleMenu = function () {
                        $scope.isCollapsed = !$scope.isCollapsed;
                    };
                }
            }).result.then($scope.postClose, $scope.postClose);

        };
    }
]);
