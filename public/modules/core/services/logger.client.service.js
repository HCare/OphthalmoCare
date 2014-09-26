'use strict';
/*
 Created by yass on 9/25/2014.
 */

angular.module('core').factory('Logger', ['$log', 'toaster',
    function ($log, toaster) {
        var logger = {};
        logger.note = function (message, show_toast) {
            $log.log(message);
            if(show_toast) {
                toaster.pop('note', 'Note', message);
            }
        };

        logger.success = function (message, show_toast) {
            $log.info(message);
            if(show_toast) {
                toaster.pop('success', 'Success', message);
            }
        };

        logger.warn = function (message, show_toast) {
            $log.warn(message);
            if(show_toast) {
                toaster.pop('warning', 'Warning', message);
            }
        };

        logger.error=function(message, show_toast){
            if(Array.isArray(message)){
                for(var i in message){
                    $log.error(message[i]);
                    if(show_toast){
                        toaster.pop('error', 'Error', message[i]);
                    }
                }
            }
            else{
            $log.error(message);
            if(show_toast){
                toaster.pop('error', 'Error', message);
            }
            }
        };

        logger.debug=function(messsage){
            $log.debug(messsage);
        };

        return logger;
    }
]);
