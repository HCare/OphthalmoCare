'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors'),
    User = mongoose.model('User'),
    _ = require('lodash');

/**
 * Extend user's controller
 */
/*module.exports = _.extend(
	require('./users/users.authentication'),
	require('./users/users.authorization'),
	require('./users/users.password'),
	require('./users/users.profile')
);*/

///create user
exports.create = function(req, res) {
    var user = new User(req.body);
    user.created._user=req.user;

    user.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(user);
        }
    });
};

///show the current user
exports.read = function(req, res) {
    res.jsonp(req.user);
};

///update user
exports.update = function(req, res) {
    var user = req.user ;

    user = _.extend(user , req.body);

    user.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(user);
        }
    });
};


///delete user
exports.delete = function(req, res) {
    var user = req.user ;

    user.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(user);
        }
    });
};


///list users
exports.list = function(req, res) { User.find().sort('fullName').exec(function(err, users) {
    if (err) {
        return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
        });
    } else {
        res.jsonp(users);
    }
});
};

///user by id
exports.userByID = function(req, res, next, id) { User.findById(id).exec(function(err, user) {
    if (err) return next(err);
    if (! user) return next(new Error('Failed to load Role ' + id));
    req.user = user ;
    next();
});
};

