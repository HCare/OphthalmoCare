'use strict';

/**
 * Module dependencies.
 */
var config = require('../../config/config'),
    moment=require('moment'),
	errorHandler = require('./errors'),
    model = require('../../app/models/person'),
    fileHandler =require('../../app/controllers/file-handle'),
    db=model.db,
    Patient=model.Person,
	_ = require('lodash'),
    moment=require('moment'),
    mime = require('mime-types'),
    filesRoot=config.filesUpload;

/**
 * render patient photo
 */
exports.renderPhoto=function(req, res){
    var patient=req.patient;
    var time = patient._createdTime;
    var photoPath =filesRoot+ moment(time).year()+'/'+
        (moment(time).month()+1)+'/'+
        moment(time).date()+'/'+
        patient.id+'/'+patient.personalPhoto;
        fileHandler.getFile(photoPath, function(err, data){
        if(err){
            console.log('err: '+err);
        }
        else{
            var fileType=mime.lookup(photoPath);
            res.writeHead(200, {'Content-Type': fileType});
            res.end(data);
        }
    });

};

/**
 * Create a Patient
 */
exports.create = function(req, res, next) {
	var patient = req.body;
	patient._createdUser = req.user._id;
    Patient.save(patient, function(err, newPatient) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
            if(patient.personalPhoto)
            {
                var time = newPatient._createdTime;
                var photoPath = moment(time).year()+'/'+
                          (moment(time).month()+1)+'/'+
                           moment(time).date()+'/'+
                            newPatient.id+'/';
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
exports.update = function(req, res) {
	var patient = req.patient ;
    patient._updateUser = req.user._id;
    patient._updatedTime = moment();
	patient = _.extend(patient , req.body);
	Patient.save(patient, function(err) {
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
 * Delete an Patient
 */
exports.delete = function(req, res) {
	var patient = req.patient ;
	db.delete(patient, function(err) {
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
exports.list = function(req, res) { Patient.findAll(function(err, patients) {
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
exports.patientByID = function(req, res, next, id) {
    Patient.read(id, function(err, patient) {
		if (err) {
            return next(err);
        }
		if (! patient) {
            return next(new Error('Failed to load Patient ' + id));
        }
		req.patient = patient ;
		next();
	});
};
