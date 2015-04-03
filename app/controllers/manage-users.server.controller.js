'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors'),
    ManageUser = mongoose.model('User'),
    Role = mongoose.model('Role'),
    _ = require('lodash'),
    Person = require('../../app/models/person');
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
            //console.log(manageUser);
            var userRole=Role.findById(manageUser._role, function (err, role) {
                if (err) {
                    manageUser.remove();
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                }
                else{

                    var person={_id:manageUser.id, fullName:manageUser.fullName, email:manageUser.email};
                    var personModel=new Person([role.name]);
                    personModel.save(person, function(err, newPerson) {
                        if (err) {
                            manageUser.remove();
                            return res.status(400).send({
                                message: errorHandler.getErrorMessage(err)
                            });
                        }
                        else {
                            res.jsonp(newPerson);
                        }
                    });

                }


                });


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
exports.list = function(req, res) {

    if (req.query && Object.keys(req.query).length > 0) {
        //password
        delete req.query.password; // didn't search by password
        //fullName
        if (req.query.hasOwnProperty('fullName') && req.query.fullName && req.query.fullName.length > 0) {
            req.query.fullName = {$regex: '.*' + req.query.fullName + '.*', $options: 'i'};
        }
        else {
            delete req.query.fullName; // didn't search by fullName
        }
        //displayName
        if (req.query.hasOwnProperty('displayName') && req.query.displayName && req.query.displayName.length > 0) {
            req.query.displayName = {$regex: '.*' + req.query.displayName + '.*', $options: 'i'};
        }
        else {
            delete req.query.displayName; // didn't search by displayName
        }
        //email
        if (req.query.hasOwnProperty('email') && req.query.email && req.query.email.length > 0) {
            req.query.email = {$regex: '.*' + req.query.email + '.*', $options: 'i'};
        }
        else {
             req.query.email = {$nin: ['admin@ophthalmo.care', 'sysadmin@ophthalmo.care']}; // didn't search by email
        }
        //_role
        if (req.query.hasOwnProperty('_role') && req.query._role && req.query._role.length > 0) {
            req.query._role = {$regex: '.*' + req.query._role + '.*', $options: 'i'};
        }
        else {
            delete req.query._role; // didn't search by _role
        }
        ManageUser.find(req.query).where('email').nin(['admin@ophthalmo.care', 'sysadmin@ophthalmo.care']).sort('fullName').populate('_role').exec(function (err, manageUsers) {
         if (err) {
             return res.status(400).send({
             message: errorHandler.getErrorMessage(err)
         });
         }
         else {
             res.jsonp(manageUsers);
             console.log('manageUsers : '+manageUsers);
         }
         });

    }
    else {
        ManageUser.find({ 'email': {'$nin': ['admin@ophthalmo.care', 'sysadmin@ophthalmo.care']} }).sort('fullName').populate('_role').exec(function (err, manageUsers) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(manageUsers);
            }
        });
    }
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
