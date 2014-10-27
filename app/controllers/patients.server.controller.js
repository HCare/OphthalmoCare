'use strict';

/**
 * Module dependencies.
 */
var moment=require('moment'),
	errorHandler = require('./errors'),
    model = require('../../app/models/person'),
    db=model.db,
    Patient=model.Person,
	_ = require('lodash');

/**
 * Create a Patient
 */
exports.create = function(req, res, next) {
    console.log('create patient \n\r');
	var patient = req.body;
    //patient.created=new type.UserAndTime(req.user._id);
	patient._createdUser = req.user._id;
    //console.log(JSON.stringify(patient)+'\n\r');
    Patient.save(patient, function(err, newPatient) {
		if (err) {
            //console.log('err : '+JSON.stringify(err)+'\n\r');
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
            //console.log('added : '+newPatient+'\n\r');
            if(patient.photo)
            {
                var time = newPatient._createdTime;
                var path = moment(time).year()+'/'+
                          (moment(time).month+1)+'/'+
                           moment(time).date()+'/'+
                            newPatient.id+'/';

                _.extend(req.body, {filePath : path});
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
    //console.log('update patient \n\r');
	var patient = req.patient ;
    //console.log(JSON.stringify(patient)+'\n\r');
    //patient.updated=type.UserAndTime(req.user._id);
    patient._updateUser = req.user._id;
    patient._updatedTime = new Date();
    //console.log(JSON.stringify(patient)+'\n\r');

	patient = _.extend(patient , req.body);
    //console.log(JSON.stringify(patient)+'\n\r');
	Patient.save(patient, function(err) {
		if (err) {
            //console.log(JSON.stringify(err)+'\n\r');
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
            //console.log('updated : '+JSON.stringify(patient)+'\n\r');
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
    //console.log('find:'+id+' \n\r');
    Patient.read(id, function(err, patient) {
        //console.log('read:'+id+' \n\r');
    console.log(JSON.stringify(patient)+'\n\r');
		if (err) {
            //console.log('err :' + err + '\n\r');
            return next(err);
        }
		if (! patient) {
            //console.log('err : no patient \n\r');
            return next(new Error('Failed to load Patient ' + id));
        }
		req.patient = patient ;
		next();
	});
};

/**
 * Patient authorization middleware
 */
/*
exports.hasAuthorization = function(req, res, next) {
	if (req.patient.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};*/
