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
exports.list = function (req, res) {
    Action.find().sort('order').exec(function (err, actions) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        res.jsonp(actions);
    });
};

/**
 * Action middleware
 */
exports.actionByID = function (req, res, next, id) {
    Action.findById(id).exec(function (err, action) {
        if (err) return next(err);
        if (!action) return next(new Error('Failed to load Action ' + id));
        req.action = action;
        next();
    });
};

