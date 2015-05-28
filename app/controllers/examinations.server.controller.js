'use strict';

/**
 * Module dependencies.
 */
var config = require('../../config/config'),
    moment = require('moment'),
    errorHandler = require('./errors'),
    Examination = require('../../app/models/examination'),
    ExaminationItem = require('../../app/models/examinationItem'),
    _ = require('lodash'),
    Person = require('../../app/models/person');

/**
 * Create a Examination
 */
exports.create = function (req, res) {
    var examination = req.body;
    var user = req.user;
    var personModel = new Person();
    personModel.where({_id: user._id}, function (err, persons) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        if (!persons) {
            return res.status(400).send({
                message: 'Failed to load Person ' + user._id
            });
        }
        if (persons.length != 1) {
            return res.status(400).send({
                message: 'Failed to load Person ' + user._id
            });
        }
        var person = persons[0];
        var examinationModel = new Examination();
        examinationModel.compose(personModel, 'examiner', 'examined_by');
        var examinationObj=JSON.parse(JSON.stringify(examination));
        examinationObj.examiner = person;
        delete examinationObj.OS;
        delete examinationObj.OD;
        delete examinationObj.patientId;
        examinationModel.save(examinationObj, function (err, newExamination) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                })
            }
            function saveExaminationItem(obj, labels, callback, relName, toModel, toNodes){
                var examinationItemModel = new ExaminationItem(labels);
                if (rel && toNodes){
                    examinationItemModel.compose(toModel, 'related', relName);
                    obj.related=toNodes
                }
                examinationItemModel.save(obj, function(err, newObj){
                    if (err) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    }
                    callback(obj);
                });
            }
            function traverse(obj, depth){

                for(var i in obj){
                    if(obj[i]!=null){
                        if(typeof(obj[i])=="object")
                        {
                            if(Array.isArray(obj[i])){
                                for(var n in obj[i]){
                                    console.log(depth);
                                    console.log(i);
                                    console.log(obj[i][n])
                                }
                            }
                            else{
                                console.log(depth);
                                console.log(i);
                                traverse(obj[i], depth+1);
                            }
                        }
                        else
                        {
                            console.log(depth);
                            console.log(i);
                            console.log(obj[i]);
                        }

                    }
                }
            }
            traverse(examination, 0);

            res.jsonp(newExamination);


        });


    });

    /*examination.save(function(err) {
     if (err) {
     return res.status(400).send({
     message: errorHandler.getErrorMessage(err)
     });
     } else {
     res.jsonp(examination);
     }
     });*/
};

/**
 * Show the current Examination
 */
exports.read = function (req, res) {
    res.jsonp(req.examination);
};

/**
 * Update a Examination
 */
exports.update = function (req, res) {
    var examination = req.examination;

    examination = _.extend(examination, req.body);

    examination.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(examination);
        }
    });
};

/**
 * Delete an Examination
 */
exports.delete = function (req, res) {
    var examination = req.examination;

    examination.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(examination);
        }
    });
};

/**
 * List of Examinations
 */
exports.list = function (req, res) {
    Examination.find().sort('-created').populate('user', 'displayName').exec(function (err, examinations) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(examinations);
        }
    });
};

/**
 * Examination middleware
 */
exports.examinationByID = function (req, res, next, id) {
    Examination.findById(id).populate('user', 'displayName').exec(function (err, examination) {
        if (err) return next(err);
        if (!examination) return next(new Error('Failed to load Examination ' + id));
        req.examination = examination;
        next();
    });
};

/**
 * Examination authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    if (req.examination.user.id !== req.user.id) {
        return res.status(403).send('User is not authorized');
    }
    next();
};
