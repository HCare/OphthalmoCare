'use strict';

angular.module('directives')
    .directive("hCareEditButton", function(Authentication, lodash){
    return{
        restrict: "E",
        replace: true,
        scope: {
            href: '@'
        },
        link :function(scope, el, atts){
            if(lodash.contains(Authentication.user._role._actions, atts.action)){
                atts.$observe('href', function(href){
                    var buttonText = '<a class="btn btn-primary" href='+ href +'>' +
                        '<i class="glyphicon glyphicon-edit"></i>' +
                        '</a>';
                    el.html(buttonText);
                });
            }
        }
    }
});