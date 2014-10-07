'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	User = mongoose.model('User'),
    passport = require('passport'),
	_ = require('lodash');

//exports.isAuthenticated=function(req, res){
//    if (!req.isAuthenticated()) {
//        return res.status(401).send({
//            message: 'User is not logged in'
//        });
//    }
//    else{
//        res.jsonp(req.user);
//    }
//}

exports.signin = function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err || !user) {
            res.status(400).send(info);
        } else {
            // Remove sensitive data before login
            user.password = undefined;
            user.salt = undefined;

            req.login(user, function(err) {
                if (err) {
                    res.status(400).send(err);
                } else {
                    res.jsonp(user);
                }
            });
        }
    })(req, res, next);
};

exports.signout = function(req, res) {
    req.logout();
    res.redirect('/');
};


/**
 * Require login routing middleware
 */
exports.requiresLogin = function(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(401).send({
            message: 'User is not logged in'
        });
    }
    next();
};


/**
 * User authorizations routing middleware
 */
exports.authorizedToDo = function(action) {
    console.log('check auth\n\r');
    var _this = this;
    return function(req, res, next) {
        _this.requiresLogin(req, res, function() {
            User.findOne({
                _id: req.user._id
            }).populate('_role').exec(function(err, manageUser) {
                if (err) {
                    return res.status(400).send(err);
                }
                else if (!manageUser) {
                    return res.status(400).send(new Error('Failed to load User ' + req.user._id));
                }
                else{
                    if(!action){
                        action=req.params.actionId;
                        console.log('parameter: '+req.params.actionId+'\n\r');
                    }
                    console.log('action: '+action);
                    console.log(manageUser._role._actions+'\n\r');
                    var x=_.contains(manageUser._role._actions, action);
                    console.log(x+'\n\r');
                    if (_.contains(manageUser._role._actions, action)) {
                        return next();
                    } else {
                        return res.status(403).send({
                            message: 'User is not authorized'
                        });
                    }
                }
            });
        });
    };
};

/**show the current user
 *
 */
exports.authorized = function(req, res) {
    res.jsonp(1);
};