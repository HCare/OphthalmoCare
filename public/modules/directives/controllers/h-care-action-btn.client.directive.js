'use strict';

angular.module('directives')
    .directive("hCareActionBtn", function(Authentication, lodash){
        return{
            restrict: "E",
            replace: true,
            link :function(scope, element, atts){
                if(lodash.contains(Authentication.user._role._actions, atts.action)){

                    if(atts.redirectUrl != null && atts.redirectUrl != undefined && atts.redirectUrl != ''){
                        atts.$observe('redirectUrl', function(redirectUrl){
                            var buttonText = '<a class="btn btn-default" title='+ atts.title +' href='+ redirectUrl +'>' +
                                '<i class="glyphicon glyphicon-' +  atts.icon + '"></i>' +
                                '</a>';
                            element.html(buttonText);
                        });
                    }

                    if(atts.clickEvent != null && atts.clickEvent != undefined && atts.clickEvent !='') {
                        var buttonText = "<a class='btn btn-default' title="+ atts.title +" >" +
                            "<i class='glyphicon glyphicon-"+ atts.icon +"'></i>" +
                            "</a>";
                        element.html(buttonText);
                        element.on("click", function () {
                            if(atts.responseMessage != null && atts.responseMessage != undefined && atts.responseMessage !='') {
                                if (confirm(atts.responseMessage)) {
                                    //apply only
                                    scope.$apply(atts.clickEvent);

                                }
                            }
                            else {
                                scope.$apply(atts.clickEvent);
                            }
                        });
                    }

                }
            }
        }
    });
