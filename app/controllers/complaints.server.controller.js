'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Complaint = mongoose.model('Complaint'),
	_ = require('lodash');

/**
 * Create a Complaint
 */
exports.create = function(req, res) {
	var complaint = new Complaint(req.body);
	complaint.user = req.user;

	complaint.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(complaint);
		}
	});
};

/**
 * Show the current Complaint
 */
exports.read = function(req, res) {
	res.jsonp(req.complaint);
};

/**
 * Update a Complaint
 */
exports.update = function(req, res) {
	var complaint = req.complaint ;

	complaint = _.extend(complaint , req.body);

	complaint.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(complaint);
		}
	});
};

/**
 * Delete an Complaint
 */
exports.delete = function(req, res) {
	var complaint = req.complaint ;

	complaint.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(complaint);
		}
	});
};

/**
 * List of Complaints
 */
exports.list = function(req, res) { Complaint.find().sort('-created').populate('user', 'displayName').exec(function(err, complaints) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(complaints);
		}
	});
};

/**
 * Complaint middleware
 */
exports.complaintByID = function(req, res, next, id) { Complaint.findById(id).populate('user', 'displayName').exec(function(err, complaint) {
		if (err) return next(err);
		if (! complaint) return next(new Error('Failed to load Complaint ' + id));
		req.complaint = complaint ;
		next();
	});
};

/**
 * Complaint authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.complaint.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};