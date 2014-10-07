'use strict';

//Setting up route
angular.module('roles').config(['$stateProvider',
    function ($stateProvider) {
        /*console.log('config roles module');*/
        /*var isAuthorized=function($q, $timeout, $resource, $location){
         var deferred = $q.defer();
         // Make an AJAX call to check if the user is logged in
         $resource('/auth/is-authorized/list_roles').get().$promise.then(function(response){
         alert('success');
         alert(JSON.stringify(response));
         deferred.resolve();
         }, function (errorResponse) {
         ///log error message
         alert('error');
         alert(JSON.stringify(errorResponse));
         deferred.reject();
         $location.url('/');
         //$scope.error = errorResponse.data.message;
         });*/
        /*$http.get('/auth/is-authorized').success(function(authorized) {
         console.log(authorized);
         // Authenticated
         if (authorized) {
         $timeout(deferred.resolve);
         }
         // Not Authenticated
         else {
         $timeout(deferred.reject);
         $location.url('/');
         }
         }).error(function (data, status, headers, config) {
         //console.log("error");
         alert("error");

         */
        /* console.log(data);
         console.log(status);
         console.log(headers);
         console.log(config);*/
        /*

         $timeout(deferred.reject);
         $location.url('/');
         });

         return deferred.promise;
         };*/

        // Roles state routing
        $stateProvider.
            state('listRoles', {
                url: '/roles',
                templateUrl: 'modules/roles/views/list-roles.client.view.html',
                requiresLogin: true,
                action: 'list_roles'
                /*,
                resolve: {authorized: function(){return authProvider.config('ss');}
                }*/
            }).
            state('createRole', {
                url: '/roles/create',
                templateUrl: 'modules/roles/views/create-role.client.view.html',
                requiresLogin: true,
                action: 'create_role'
                /*,
                 resolve:{authorized:security.isAuthorized}*/
            }).
            state('viewRole', {
                url: '/roles/:roleId',
                templateUrl: 'modules/roles/views/view-role.client.view.html',
                requiresLogin: true,
                action: 'view_role'
                /*,
                 resolve:{authorized:security.isAuthorized}*/
            }).
            state('editRole', {
                url: '/roles/:roleId/edit',
                templateUrl: 'modules/roles/views/edit-role.client.view.html',
                requiresLogin: true,
                action: 'edit_role'
                /*,
                 resolve:{authorized:security.isAuthorized}*/
            });
    }
]);