/*
'use strict';

*/
/**
 * Module dependencies.
 *//*

var mongoose = require('mongoose'),
    errorHandler = require('./errors'),
    User = mongoose.model('User'),
    _ = require('lodash');

*/
/**
 * Extend user's controller
 *//*

*/
/*module.exports = _.extend(
	require('./users/users.authentication'),
	require('./users/users.authorization'),
	require('./users/users.password'),
	require('./users/users.profile')
);*//*


///create user
exports.create = function(req, res) {
    var appUser = new User(req.body);
    appUser.created._user=req.user;

    appUser.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(appUser);
        }
    });
};

///show the current user
exports.read = function(req, res) {
    res.jsonp(req.appUser);
};

///update user
exports.update = function(req, res) {
    var appUser = req.appUser;
    appUser = _.extend(appUser , req.body);
    appUser.updated._user=req.user;
    appUser.updated.time=new Date();

    appUser.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(appUser);
        }
    });
};


///delete user
exports.delete = function(req, res) {
    var appUser = req.appUser ;

    appUser.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(appUser);
        }
    });
};


///list users
exports.list = function(req, res) { User.find().sort('fullName').exec(function(err, appUsers) {
    if (err) {
        return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
        });
    } else {
        res.jsonp(appUsers);
    }
});
};

///user by id
exports.appUserByID = function(req, res, next, id) { User.findById(id).populate('_role').exec(function(err, appUser) {
    if (err) return next(err);
    if (! appUser) return next(new Error('Failed to load User ' + id));
    req.appUser = appUser ;
    next();
});
};

*/
