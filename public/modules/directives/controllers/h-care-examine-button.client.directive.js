'use strict';
angular.module('directives')
    .directive("hCareExamineButton", function(Authentication, lodash){
        return{
            restrict: "E",
            replace: true,
            link :function(scope, el, atts){
                if(lodash.contains(Authentication.user._role._actions, atts.action)){
                    var buttonText = "<a class='btn btn-primary' ><i class='glyphicon glyphicon-eye-open'></i></a>";
                    el.html(buttonText);
                    el.on("click", function(){
                            scope.$apply(atts.hcareExamineClick);
                    });
                }

            }
        }
    });