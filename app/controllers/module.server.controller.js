'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Module = mongoose.model('Module'),
    errorHandler = require('./errors'),
    _ = require('lodash');

/**
 * List of Modules
 */
exports.list = function (req, res) {
    Module.find().sort('order').exec(function (err, modules) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        res.jsonp(modules);
    });
};