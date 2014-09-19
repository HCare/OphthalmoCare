'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
    Action = mongoose.model('Action'),
    errorHandler = require('./errors'),
    _ = require('lodash');

/**
 * List of Actions
 */
exports.list = function(req, res) {
    Action.find().sort('order').exec(function (err, actions) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        res.jsonp(actions);
    });
};