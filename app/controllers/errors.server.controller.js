'use strict';

/**
 * Get unique error field name
 */
var getUniqueErrorMessage = function (err) {
    var output;

    try {
        var fieldName = err.err.substring(err.err.lastIndexOf('.$') + 2, err.err.lastIndexOf('_1'));
        output = fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + ' already exists';

    } catch (ex) {
        output = 'Unique field already exist';
    }

    return output;
};

var getInnerMesssage=function(message){
    var messageIndex=message.lastIndexOf('message:');
    var msg;
    if(messageIndex>-1){
        msg=message.substr(messageIndex+8).trim();
    }
    else
    {
        msg=message;
    }
    return msg;



};
/**
 * Get the error message from error object
 */
exports.getErrorMessage = function (err) {
    var message = '';

    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = getUniqueErrorMessage(err);
                break;
            default:
                message = 'Something went wrong';
        }
    } else if (err.errors) {
            message = [];
            for (var errName in err.errors) {
                if (err.errors[errName].message)
                {
                    message.push(err.errors[errName].message);
                }
            }
        }
    else if(err.message){
        message=getInnerMesssage(err.message);
    }



    return message;
};