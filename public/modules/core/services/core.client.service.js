'use strict';


angular.module('core').factory('CoreProperties', function () {
    var pageSubTitle = null;

    var setPageSubTitle = function (title) {
        pageSubTitle = title;
    };

    var getPageSubTitle = function () {
        return pageSubTitle;
    };

    return {
        setPageSubTitle: setPageSubTitle,
        getPageSubTitle: getPageSubTitle
    };
});
angular.module('core').factory('ActionsHandler', ['$rootScope', function ($rootScope) {
    var action = {};

    action.fireAction = function (actionName, args) {
        $rootScope.$emit(actionName, args);
    };

    action.onActionFired = function (actionName, scope, func) {
        var unbind = $rootScope.$on(actionName, func);
        scope.$on('$destroy', unbind);
    };

    return action;
}]);