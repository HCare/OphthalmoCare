'use strict';


angular.module('core').factory('Core',function(){
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