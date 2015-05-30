'use strict';

/**
 * Module dependencies.
 */
var config = require('../../config/config'),
    mongoose = require('mongoose'),
	errorHandler = require('./errors'),
    moment=require('moment'),
	Patient = mongoose.model('Patient'),
    fileHandler =require('../../app/controllers/'+config.fileHandler+'-file-handle'),
	_ = require('lodash');


/**
 * render patient photo
 */
exports.renderPhoto=function(req, res){
    var patient=req.patient;
    var time = patient.created.time;
    var photoPath =moment(time).year()+'/'+
        (moment(time).month()+1)+'/'+
        moment(time).date()+'/'+
        patient._id+'/'+patient.personalPhoto;
    fileHandler.responseFile(photoPath, res);
};

/**
 * Create a Patient
 */
exports.create = function(req, res, next) {
	var patient = new Patient(req.body);
	patient.created._user = req.user;
    var hasPhoto=patient.personalPhoto;
    if(hasPhoto==='true'){
        patient.personalPhoto=config.patientPhotoFileName;
    }
	patient.save(function(err, newPatient) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
        else {
            if(hasPhoto==='true')
            {
                var time = newPatient.created.time;
                var photoPath = moment(time).year()+'/'+
                    (moment(time).month()+1)+'/'+
                    moment(time).date()+'/'+
                    newPatient._id+'/';
                _.extend(req.body, {filePath : photoPath});
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
exports.read = function(req, res) {
	res.jsonp(req.patient);
};

/**
 * Update a Patient
 */
exports.update = function(req, res, next) {
	var patient = req.patient;
	patient = _.extend(patient , req.body);
    patient.updated._user=req.user;
    patient.updated.time=Date.now;
    var hasPhoto=patient.personalPhoto;
    if(hasPhoto==='true'){
        patient.personalPhoto=config.patientPhotoFileName;
    }
	patient.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
            if(hasPhoto==='true')
            {
                var time = patient.created.time;
                var photoPath = moment(time).year()+'/'+
                    (moment(time).month()+1)+'/'+
                    moment(time).date()+'/'+
                    patient._id+'/';
                _.extend(req.body, {filePath : photoPath});
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
exports.delete = function(req, res) {
	var patient = req.patient ;

	patient.remove(function(err) {
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
exports.list = function(req, res) { Patient.find().sort('-created').populate('user', 'displayName').exec(function(err, patients) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(patients);
		}
	});
};

/**
 * Patient middleware
 */
exports.patientByID = function(req, res, next, id) { Patient.findById(id).populate('user', 'displayName').exec(function(err, patient) {
		if (err) return next(err);
		if (! patient) return next(new Error('Failed to load Patient ' + id));
		req.patient = patient ;
		next();
	});
};

/**
 * Patient authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.patient.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};