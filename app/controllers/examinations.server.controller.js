'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Examination = mongoose.model('Examination'),
	_ = require('lodash');

/**
 * Create a Examination
 */
exports.create = function(req, res) {
    console.log(req.body);
	var examination = new Examination(req.body);
	examination.created._user = req.user;
    console.log(examination);
	examination.save(function(err) {
        console.log(err);
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(examination);
		}
	});
};

/**
 * Show the current Examination
 */
exports.read = function(req, res) {
	res.jsonp(req.examination);
};

/**
 * Update a Examination
 */
exports.update = function(req, res) {
	var examination = req.examination ;
    examination.updated._user = req.user;
    examination.updated.time = new Date();
	examination = _.extend(examination , req.body);
    console.log(examination);
	examination.save(function(err) {
		if (err) {
            console.log(err);
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(examination);
		}
	});
};

/**
 * Delete an Examination
 */
exports.delete = function(req, res) {
	var examination = req.examination ;

	examination.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(examination);
		}
	});
};

/**
 * List of Examinations
 */
exports.list = function(req, res) { Examination.find().sort('-created').populate('created._user', 'displayName').exec(function(err, examinations) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(examinations);
		}
	});
};

/**
 * Examination middleware
 */
exports.examinationByID = function(req, res, next, id) { Examination.findById(id).populate('user', 'displayName').exec(function(err, examination) {
		if (err) return next(err);
		if (! examination) return next(new Error('Failed to load Examination ' + id));
		req.examination = examination ;
		next();
	});
};

/**
 * Examination authorization middleware
 */
/*
exports.hasAuthorization = function(req, res, next) {
	if (req.examination.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
    */