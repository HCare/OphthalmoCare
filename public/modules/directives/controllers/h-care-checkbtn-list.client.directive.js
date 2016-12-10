'use strict';

angular.module('directives')
    .directive("hCareCheckbtnList", function (Authentication, lodash) {
        return{
            restrict: "E",
            replace: true,
            scope: {
                source: '=',
                itemLabelField: '@',
                itemValueField: '@',
                itemClicked: '&',
                selectedItems: '=',
                selectedItemsIds: '@',
                currentTappedItem: '='
            },
           /* template: '<div class="btn-group" data-toggle="buttons" id={{atts.id}}>' +
                '<label class="btn btn-primary" ' +
                'ng-class="{active:selectedItemsIds  && selectedItemsIds.indexOf(item[itemValueField]) !== -1}"' +
                'ng-repeat="item in source"> ' +
                '<input type="checkbox"' +
                'value="{{item[itemLabelField]}}" ' +
                'ng-checked="selectedItemsIds  && selectedItemsIds.indexOf(item[itemValueField]) !== -1"' +
                'ng-click="itemClicked(item)">{{item[itemLabelField]}}' +
                '</label>' +
                '</div>',*/
            templateUrl: 'modules/directives/views/h-care-checkbtn-list.client.view.html',
            link: function (scope, el, atts) {

                scope.$watch('selectedItems', function(value){
                    scope.selectedItems = scope.selectedItems || [];
                    scope.selectedItemsIds =  [];
                    for(var i in scope.selectedItems)
                    {
                        if (!lodash.contains(scope.selectedItemsIds, scope.selectedItems[i][scope.itemValueField])) {
                            scope.selectedItemsIds.push(scope.selectedItems[i][scope.itemValueField]);
                        }
                    }
                },true);

                scope.itemClicked = function (item) {
                    scope.selectedItemsIds = scope.selectedItemsIds || [];
                    scope.selectedItems = scope.selectedItems || [];
                    if (atts.isActiveOnClick && atts.isActiveOnClick == "true"){

                        if (atts.isMultiSelection && atts.isMultiSelection == "true"){
                            if (!lodash.contains(scope.selectedItemsIds, item[scope.itemValueField])) {
                                scope.selectedItemsIds.push(item[scope.itemValueField]);
                                scope.selectedItems.push(item);
                                scope.currentTappedItem = item;
                            }
                            else{
                                var index = scope.selectedItemsIds.indexOf(item[scope.itemValueField]);
                                scope.selectedItemsIds.splice(index, 1);
                                scope.selectedItems.splice(index, 1);
                                scope.currentTappedItem = null;
                            }
                        }
                        else {
                            // contains only one item
                            if (!lodash.contains(scope.selectedItemsIds, item[scope.itemValueField])) {
                                scope.selectedItemsIds = [];
                                scope.selectedItems = [];
                                scope.selectedItemsIds.push(item[scope.itemValueField]);
                                scope.selectedItems.push(item);
                                scope.currentTappedItem = item;
                            }
                            else
                            {
                                var index = scope.selectedItemsIds.indexOf(item[scope.itemValueField]);
                                scope.selectedItemsIds.splice(index, 1);
                                scope.selectedItems.splice(index, 1);
                                scope.selectedItemsIds = [];
                                scope.selectedItems = [];
                                scope.currentTappedItem = null;
                            }
                        }

                    }
                    else{
                        scope.currentTappedItem = item;
                    }
                };
            }
        }
    });


