'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	User = mongoose.model('User'),
    passport = require('passport'),
	_ = require('lodash');
_.mixin({
    'findByValues': function (collection, property, values) {
        return _.filter(collection, function (item) {
            return _.contains(values, item[property]);
        });
    }
});
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
exports.authorizedToDo = function(actions) {
    if(!Array.isArray(actions)){
      var action=actions;
        actions=[];
        actions.push(action);
    };
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
                    if(!actions){
                        actions=[];
                        actions.push[req.params.actionId];
                    }
                    //console.log(manageUser._role._actions);
                    //console.log(actions);
                    //console.log(_.intersection(manageUser._role._actions, actions));
                    if (_.intersection(manageUser._role._actions, actions).length>0) {
                        return next();
                    } else {
                        //console.log('not authorized to : '+actions.join(' or '));
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