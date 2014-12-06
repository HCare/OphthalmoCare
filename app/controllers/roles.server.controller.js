'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors'),
    Role = mongoose.model('Role'),
    _ = require('lodash');

/**
 * Create a Role
 */
exports.create = function (req, res) {
    var role = new Role(req.body);
    role.created._user = req.user;
    role.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(role);
        }
    });
};

/**
 * Show the current Role
 */
exports.read = function (req, res) {
    res.jsonp(req.role);
};

/**
 * Update a Role
 */
exports.update = function (req, res) {
    var role = req.role;
    if (role.name == 'SysAdmin') {
        return res.status(403).send({
            message: "User is not authorized"
        });
    }
    else {
        role.updated._user = req.user;
        role.updated.time = new Date();

        role = _.extend(role, req.body);

        role.save(function (err) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(role);
            }
        });
    }
};

/**
 * Delete an Role
 */
exports.delete = function (req, res) {
    var role = req.role;
    if (role.name === 'SysAdmin' || role._id === req.user._role) {
        return res.status(403).send({
            message: "User is not authorized"
        });
    }
    else {
        role.remove(function (err) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(role);
            }
        });
    }
};


/**
 * List of Searched Roles
 */
exports.search = function (req, res) {
    Role.find({'name': {'$ne': 'SysAdmin'}}).sort('name').exec(function (err, roles) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(roles);
        }
    });
};

/**
 * List of Roles
 */
exports.list = function (req, res) {
    if (req.query && Object.keys(req.query).length > 0) {
        //name
        if (req.query.hasOwnProperty('name') && req.query.name && req.query.name.length > 0 && req.query.name != 'SysAdmin') {
            req.query.name = {$regex: '.*' + req.query.name + '.*', $options: 'i'};;
        }
        else if (req.query.name == 'SysAdmin') {
            res.jsonp([]);
            return;
        }
        else {
            req.query.name = {'$ne': 'SysAdmin'}; // didn't search by name
        }
        //_actions
        if (req.query.hasOwnProperty('_actions') && req.query._actions && req.query._actions.length > 0) {
            var actionsArray = [];
            var actions = [];
            if(Array.isArray(req.query._actions))  // Array
            {
                for(var i=0; i<req.query._actions.length; i++)
                {
                    if(typeof req.query._actions[i] == 'string')
                    {
                        req.query._actions[i] = JSON.parse(req.query._actions[i]);
                    }
                    actionsArray.push(req.query._actions[i]._id);
                }
            }
            else{
                //reviver
                JSON.parse(req.query._actions, function (name, value) {
                    if (name == '_id') {
                        actionsArray.push(value);
                    }
                });
            }
            req.query._actions = {$all: actionsArray};
        }
        else {
            // didn't search by _actions
            delete req.query._actions;
        }
        Role.find(req.query).where('name').ne('SysAdmin').sort('name').exec(function (err, roles) {
            if (err) {

                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(roles);
            }
        });
    }
    else {
        Role.find({'name': {'$ne': 'SysAdmin'}}).sort('name').exec(function (err, roles) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(roles);
            }
        });
    }
};

/**
 * Role middleware
 */
exports.roleByID = function (req, res, next, id) {
    Role.findById(id).exec(function (err, role) {
        if (err) return next(err);
        if (!role) return next(new Error('Failed to load Role ' + id));
        req.role = role;
        next();
    });
};

/**
 * Role authorization middleware
 */
/*
 exports.hasAuthorization = function(req, res, next) {
 if (req.role.user.id !== req.user.id) {
 return res.status(403).send('User is not authorized');
 }
 next();
 };*/
