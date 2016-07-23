'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Visit = mongoose.model('Visit'),
	_ = require('lodash');

/**
 * Create a Visit
 */
exports.create = function(req, res) {
	var visit = new Visit(req.body);
	visit.user = req.user;

	visit.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(visit);
		}
	});
};

/**
 * Show the current Visit
 */
exports.read = function(req, res) {
	res.jsonp(req.visit);
};

/**
 * Update a Visit
 */
exports.update = function(req, res) {
	var visit = req.visit ;

	visit = _.extend(visit , req.body);

	visit.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(visit);
		}
	});
};

/**
 * Delete an Visit
 */
exports.delete = function(req, res) {
	var visit = req.visit ;

	visit.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(visit);
		}
	});
};

/**
 * List of Visits
 */
exports.list = function(req, res) { Visit.find().sort('-created').populate('user', 'displayName').exec(function(err, visits) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(visits);
		}
	});
};

/**
 * Visit middleware
 */
exports.visitByID = function(req, res, next, id) { Visit.findById(id).populate('user', 'displayName').exec(function(err, visit) {
		if (err) return next(err);
		if (! visit) return next(new Error('Failed to load Visit ' + id));
		req.visit = visit ;
		next();
	});
};

/**
 * Visit authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.visit.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};