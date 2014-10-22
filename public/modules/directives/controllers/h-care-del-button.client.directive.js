'use strict';

angular.module('directives')
    .directive("hCareDelButton", function(Authentication, lodash){
        return{
            restrict: "E",
            replace: true,
            link :function(scope, el, atts){

                if(lodash.contains(Authentication.user._role._actions, atts.action)){
                    var buttonText = "<a class='btn btn-primary' ><i class='glyphicon glyphicon-trash'></i></a>";
                    el.html(buttonText);
                    el.on("click", function(){
                        var result = confirm(atts.delMessage);
                        if(result)
                        {
                            //apply only
                            scope.$apply(atts.hcareDelClick);

                        }
                    });
                }

            }
        }
    });