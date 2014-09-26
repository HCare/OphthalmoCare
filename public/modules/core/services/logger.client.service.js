'use strict';
/*
 Created by yass on 9/25/2014.
 */

angular.module('core').factory('Logger', ['$log', 'toaster',
    function ($log, toaster) {
        var logger = {};
        logger.log = function (message) {
            $log.log(message);
        };

        logger.info = function (message, show_toast) {
            $log.info(message);
        };

        logger.warn = function (message, show_toast) {
            $log.warn(message);
        };

        logger.error=function(message, show_toast){
            $log.error(message);
            if(show_toast){
                toaster.pop('error', 'Error', message);
            }
        };

        logger.debug=function(messsage){
            $log.debug(messsage);
        };

        return logger;
    }
]);
