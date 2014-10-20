'use strict';

// Manage users controller
angular.module('directives')
    .directive("hCareDelButton", function(){
        return{
            restrict: "E",
            replace: true,
            link :function(scope, el, atts){
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
    });