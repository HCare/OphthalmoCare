'use strict';

/**
 * Module dependencies.
 */
var config = require('../../config/config'),
    moment=require('moment'),
	errorHandler = require('./errors'),
    model = require('../../app/models/person'),
    fileHandler =require('../../app/controllers/'+config.fileHandler+'-file-handle'),
    db=model.db,
    Patient=model.Person,
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
        patient.id+'/'+patient.personalPhoto;
        fileHandler.responseFile(photoPath, res);
};

/**
 * Create a Patient
 */
exports.create = function(req, res, next) {
	var patient = req.body;
	patient._createdUser = req.user._id;
    patient.birthDate=moment(patient.birthDate, 'YYYY/MM/DD').toISOString();
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
exports.update = function(req, res, next) {
	var patient = req.patient ;
    patient = _.extend(patient , req.body);
    patient.birthDate=moment(patient.birthDate, 'YYYY/MM/DD').toISOString();
    patient._updateUser = req.user._id;
    patient._updatedTime = moment().toISOString();
    var hasPhoto=patient.personalPhoto;
    if(hasPhoto==='true'){
        patient.personalPhoto=config.patientPhotoFileName;
    }
    //console.log(moment(patient.birthDate).format('YYYY/MM/DD'));
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
                    patient.id+'/';
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
exports.list = function(req, res) {
    console.log('server');

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
        console.log('req:::::::::::::: '+ JSON.stringify(req.query));
        console.log('db.find');
        //console.log(Patient);
        var predicate = {fullName:"safaa"};
        Patient.where(req.query,function (err, patients) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(patients);
                console.log(patients);
            }
        });

    }
    else {
        Patient.findAll(function (err, patients) {
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
