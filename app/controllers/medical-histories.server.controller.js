'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	MedicalHistory = mongoose.model('MedicalHistory'),
	_ = require('lodash');

/**
 * Create a Medical history
 */
exports.create = function(req, res) {
	var medicalHistory = new MedicalHistory(req.body);
	medicalHistory.user = req.user;

	medicalHistory.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(medicalHistory);
		}
	});
};

/**
 * Show the current Medical history
 */
exports.read = function(req, res) {
	res.jsonp(req.medicalHistory);
};

/**
 * Update a Medical history
 */
exports.update = function(req, res) {
	var medicalHistory = req.medicalHistory ;

	medicalHistory = _.extend(medicalHistory , req.body);

	medicalHistory.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(medicalHistory);
		}
	});
};

/**
 * Delete an Medical history
 */
exports.delete = function(req, res) {
	var medicalHistory = req.medicalHistory ;

	medicalHistory.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(medicalHistory);
		}
	});
};

/**
 * List of Medical histories
 */
exports.list = function(req, res) { MedicalHistory.find().sort('-created').populate('user', 'displayName').exec(function(err, medicalHistories) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(medicalHistories);
		}
	});
};

/**
 * Medical history middleware
 */
exports.medicalHistoryByID = function(req, res, next, id) { MedicalHistory.findById(id).populate('user', 'displayName').exec(function(err, medicalHistory) {
		if (err) return next(err);
		if (! medicalHistory) return next(new Error('Failed to load Medical history ' + id));
		req.medicalHistory = medicalHistory ;
		next();
	});
};

/**
 * Medical history authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.medicalHistory.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};