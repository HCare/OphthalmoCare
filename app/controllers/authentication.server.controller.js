'use strict';

/**
 * Created by yass on 9/19/2014.
 */

/**
 * Module dependencies.
 */
var _ = require('lodash'),
    /*errorHandler = require('errors'),
    mongoose = require('mongoose'),*/
    passport = require('passport')
    /*User = mongoose.model('User')*/;

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
 * Signin after passport authentication
 */
exports.signin = function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        console.log(JSON.stringify(user));
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
