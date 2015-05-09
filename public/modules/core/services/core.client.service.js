'use strict';


angular.module('core').factory('CoreProperties',function(){
    var pageSubTitle = null;

    var setPageSubTitle = function(title) {
        pageSubTitle=title;
    };

    var getPageSubTitle = function(){
        return pageSubTitle;
    };

    return {
        setPageSubTitle: setPageSubTitle,
        getPageSubTitle: getPageSubTitle
    };
});
angular.module('core').factory('ActionsHandler',['$rootScope', function($rootScope){
    var action = {};
    //var _actionName=null;
    action.fireAction=function(actionName, args){
        //_actionName=actionName;
        $rootScope.$emit(actionName, args);
        //console.log('action fired');
    }
    action.onActionFired=function(actionName, scope, func){
        var unbind = $rootScope.$on(actionName, func);
        //console.log(func);
        scope.$on('$destroy', unbind);
        //console.log('action unbind');
    }

    return action;
}]);