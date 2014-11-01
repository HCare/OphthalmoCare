'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors'),
    ManageUser = mongoose.model('User'),
    _ = require('lodash');

/**
 * Create a Manage user
 */
exports.create = function(req, res) {
	var manageUser = new ManageUser(req.body);
	manageUser.user = req.user;
    manageUser.created._user=req.user;

	manageUser.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(manageUser);
		}
	});
};

/**
 * Show the current Manage user
 */
exports.read = function(req, res) {
	res.jsonp(req.manageUser);
};

/**
 * Update a Manage user
 */
exports.update = function(req, res) {
	var manageUser = req.manageUser;
    if(manageUser.email === 'admin@ophthalmo.care' || manageUser.email ==='sysadmin@ophthalmo.care'|| manageUser.email===req.user.email)
    {
        return res.status(403).send({
            message: "User is not authorized"
        });
    }
    else {
        manageUser = _.extend(manageUser, req.body);
        manageUser.updated._user = req.user;
        manageUser.updated.time = new Date();

        manageUser.save(function (err) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(manageUser);
            }
        });
    }
};

/**
 * Delete an Manage user
 */
exports.delete = function(req, res) {
	var manageUser = req.manageUser ;
    if(manageUser.email === 'admin@ophthalmo.care' || manageUser.email ==='sysadmin@ophthalmo.care'|| manageUser.email===req.user.email)
    {
        return res.status(403).send({
            message: "User is not authorized"
        });
    }
    else{
        manageUser.remove(function (err) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(manageUser);
            }
        });
    }
};

/**
 * List of Manage users
 */
exports.list = function(req, res) { ManageUser.find({ 'email': {'$nin':['admin@ophthalmo.care', 'sysadmin@ophthalmo.care']} }).sort('fullName').populate('_role').exec(function(err, manageUsers) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(manageUsers);
		}
	});
};

/**
 * Manage user middleware
 */
exports.manageUserByID = function(req, res, next, id) { ManageUser.findById(id).populate('_role').exec(function(err, manageUser) {
		if (err) return next(err);
		if (! manageUser) return next(new Error('Failed to load user ' + id));
		req.manageUser = manageUser ;
		next();
	});
};

/**
 * Manage user authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.manageUser.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};