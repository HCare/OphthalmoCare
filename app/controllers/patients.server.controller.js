'use strict';

/**
 * Module dependencies.
 */
var config = require('../../config/config'),
    moment=require('moment'),
	errorHandler = require('./errors'),
    model = require('../../app/models/patient'),
    fileHandler =require('../../app/controllers/'+config.fileHandler+'-file-handle'),
    db=model.db,
    Patient=model.Patient,
	_ = require('lodash'),
    moment=require('moment');

/**
 * render patient photo
 */
exports.renderPhoto=function(req, res){
    var patient=req.patient;
    var time = patient._createdTime;
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
	var patient = req.body;
	patient._createUser = req.user._id;
    //patient._createTime = moment().valueOf();
    //console.log('birth date: '+patient.birthDate);
    patient.birthDate=moment(patient.birthDate, 'YYYY/MM/DD').valueOf();
    var hasPhoto=patient.personalPhoto;
    if(hasPhoto==='true'){
        patient.personalPhoto=config.patientPhotoFileName;
    }
    Patient.save(patient, function(err, newPatient) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
            if(hasPhoto==='true')
            {
                var time = newPatient._createdTime;
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
	var patient = req.patient ;
    patient = _.extend(patient , req.body);
    patient.birthDate=moment(patient.birthDate, 'YYYY/MM/DD').valueOf();
    patient._updateUser = req.user._id;
    //patient._updateTime = moment().valueOf();
    var hasPhoto=patient.personalPhoto;
    if(hasPhoto==='true'){
        patient.personalPhoto=config.patientPhotoFileName;
    }
    //console.log('birth date: '+patient.birthDate);
    //console.log(patient.birthDate).format('YYYY/MM/DD'));
	Patient.save(patient, function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
            if(hasPhoto==='true')
            {
                var time = patient._createdTime;
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
    Patient.where({_id:id}, function(err, patients) {
		if (err) {
            return next(err);
        }
		if (! patients) {
            return next(new Error('Failed to load Patient ' + id));
        }
        if(patients.length!=1){
            return next(new Error('Failed to load Patient ' + id));
        }
        /*delete patient._createUser;
        delete patient._createTime;
        delete patient._updateUser;
        delete patient._updateTime;*/
        var patient=patients[0];
        patient.birthDate=moment(patient.birthDate).format('YYYY/MM/DD');
            req.patient = patient ;
		next();
	});
};
