'use strict';

/**
 * Module dependencies.
 */
var config = require('../../config/config'),
    mongoose = require('mongoose'),
    errorHandler = require('./errors'),
    moment = require('moment'),
    Patient = mongoose.model('Patient'),
    fileHandler = require('../../app/controllers/' + config.fileHandler + '-file-handle'),
    _ = require('lodash');


/**
 * render patient photo
 */
exports.renderPhoto = function (req, res) {
    var patient = req.patient;
    var time = patient.created.time;
    var photoPath = moment(time).year() + '/' +
        (moment(time).month() + 1) + '/' +
        moment(time).date() + '/' +
        patient._id + '/' + patient.personalPhoto;
    fileHandler.responseFile(photoPath, res);
};

/**
 * Create a Patient
 */
exports.create = function (req, res, next) {
    var patient = new Patient(req.body);
    patient.created._user = req.user;
    var hasPhoto = patient.personalPhoto;
    if (hasPhoto === 'true') {
        patient.personalPhoto = config.patientPhotoFileName;
    }
    patient.save(function (err, newPatient) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        else {
            if (hasPhoto === 'true') {
                var time = newPatient.created.time;
                var photoPath = moment(time).year() + '/' +
                    (moment(time).month() + 1) + '/' +
                    moment(time).date() + '/' +
                    newPatient._id + '/';
                _.extend(req.body, {filePath: photoPath});
                _.extend(req.body, newPatient);
                next();
                return;
            }
            res.jsonp(newPatient);
        }
    });
};

/**
 * Show the current Patient
 */
exports.read = function (req, res) {
    res.jsonp(req.patient);
};

/**
 * Update a Patient
 */
exports.update = function (req, res, next) {
    var patient = req.patient;
    patient = _.extend(patient, req.body);
    patient.updated._user = req.user;
    patient.updated.time = Date.now();
    var hasPhoto = patient.personalPhoto;
    if (hasPhoto === 'true') {
        patient.personalPhoto = config.patientPhotoFileName;
    }
    patient.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            if (hasPhoto === 'true') {
                var time = patient.created.time;
                var photoPath = moment(time).year() + '/' +
                    (moment(time).month() + 1) + '/' +
                    moment(time).date() + '/' +
                    patient._id + '/';
                _.extend(req.body, {filePath: photoPath});
                _.extend(req.body, patient);
                next();
                return;
            }
            res.jsonp(patient);
        }
    });
};

/**
 * Delete an Patient
 */
exports.delete = function (req, res) {
    var patient = req.patient;

    patient.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(patient);
        }
    });
};

/**
 * List of Patients
 */
exports.list = function (req, res) {
    console.log('list');
    if (req.query && Object.keys(req.query).length > 0) {
            //fullName
            if (req.query.hasOwnProperty('fullName') && req.query.fullName && req.query.fullName.length > 0) {
                req.query.fullName = new RegExp('.*' + req.query.fullName + '.*', 'i');
            }
            else {
                delete req.query.fullName; // didn't search by fullName
            }
            //gender
            if (req.query.hasOwnProperty('gender') && req.query.gender && req.query.gender.length > 0) {
            }
            else {
                delete req.query.gender; // didn't search by gender
            }
            //birthDate
            if (req.query.hasOwnProperty('birthDate') && req.query.birthDate && req.query.birthDate.length > 0) {
            }
            else {
                delete req.query.birthDate; // didn't search by birthDate
            }
            //tel
            if (req.query.hasOwnProperty('tel') && req.query.tel && req.query.tel.length > 0) {
                //req.query.tel = {$regex: '.*' + req.query.tel + '.*', $options: 'i'};
                req.query.tel = new RegExp('.*' + req.query.tel + '.*', 'i');
            }
            else {
                delete req.query.tel; // didn't search by tel
            }
            //address
            if (req.query.hasOwnProperty('address') && req.query.address && req.query.address.length > 0) {
                //req.query.address = {$regex: '.*' + req.query.address + '.*', $options: 'i'};
                req.query.address = new RegExp('.*' + req.query.address + '.*', 'i');
            }
            else {
                delete req.query.address; // didn't search by address
            }
            //email
            if (req.query.hasOwnProperty('email') && req.query.email && req.query.email.length > 0) {
                //req.query.email = {$regex: '.*' + req.query.email + '.*', $options: 'i'};
                req.query.email = new RegExp('.*' + req.query.email + '.*', 'i');
            }
            else {
                delete req.query.email; // didn't search by email
            }
            //notes
            if (req.query.hasOwnProperty('notes') && req.query.notes && req.query.notes.length > 0) {
                //req.query.notes = {$regex: '.*' + req.query.notes + '.*', $options: 'i'};
                req.query.notes = new RegExp('.*' + req.query.notes + '.*', 'i');
            }
            else {
                delete req.query.notes; // didn't search by notes
            }

            Patient.find(req.query).exec(function (err, patients) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    console.log(patients);
                    res.jsonp(patients);
                }
            });
    }
    else {
        Patient.find().exec(function (err, patients) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(patients);
            }
        });
    }
};

/**
 * Patient middleware
 */
exports.patientByID = function (req, res, next, id) {
    Patient.findById(id).populate('user', 'displayName').exec(function (err, patient) {
        if (err) return next(err);
        if (!patient) return next(new Error('Failed to load Patient ' + id));
        req.patient = patient;
        next();
    });
};

/**
 * Patient authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    if (req.patient.user.id !== req.user.id) {
        return res.status(403).send('User is not authorized');
    }
    next();
};
