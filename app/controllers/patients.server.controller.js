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
    //console.log(req.body.data);
    var patient = new Patient(JSON.parse(req.body.data));
    patient.created._user = req.user;
    console.log(patient);
    var hasPhoto = patient.personalPhoto;
    if (hasPhoto === 'true') {
        patient.personalPhoto = config.patientPhotoFileName;
    }
    console.log(hasPhoto);
    patient.save(function (err, newPatient) {
        if (err) {
            console.log(err);
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
                _.extend(req.body, {newPatient: newPatient});
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
    patient = _.extend(patient, JSON.parse(req.body.data));

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
                _.extend(req.body, {newPatient: patient});
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
/*exports.list = function (req, res) {
    Patient.find().exec(function (err, patients) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(patients);
        }
    });
};*/

/*
exports.list= function (req, res) {
    //pagination
    var pageNo = 0, pageSize = 10;
    if (req.query.hasOwnProperty('paginationConfig')) {
        var paginationConfig = JSON.parse(req.query.paginationConfig);
        pageNo = paginationConfig.pageNo - 1;
        pageSize = paginationConfig.pageSize;
        delete req.query.paginationConfig;
    }
    Patient.find().skip(pageNo * pageSize).limit(pageSize).exec(function (err, patients) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            Patient.find(req.query).count(function (err, _count) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                }
                else {
                    res.jsonp({list: patients, count: _count});
                }

            });

        }
    });
};
*/

function getSearchQuery(property){

    var newQuery = {}; // the new query

    var queue = [];
    var queueValues = [];
    var result = "";
    var obj = null;

    if(typeof property == 'string'){
        try{
            obj = JSON.parse(property);
        }
        catch(e){
            result += " - " + property;
        }
    }
    else{
        obj = property;
    }

    if(obj != null && obj != undefined){
        for(var key in obj){
            queue.push(key);
            queueValues.push(obj[key]);
        }
        while (queue.length > 0){
            try{
                var propKey = queue[0];
                try{ // Object && Array
                    var propValue = JSON.parse(queueValues[0]);
                    if(Array.isArray(propValue) && propValue.length > 0){  // Array
                        newQuery[propKey] = {$all: propValue};
                    }
                    else if(typeof propValue == 'object'){  // Object
                        for(var k in propValue){
                            queue.push(propKey + "." + k);
                            queueValues.push(propValue[k]);
                        }
                    }
                    else if(typeof propValue == "number"){
                        newQuery[propKey] = new RegExp('.*' +  propValue + '.*', 'i');
                    }
                }
                catch(e){  // string && empty array && Already sent as array
                    if(typeof queueValues[0] == 'string'){
                        var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
                        if(checkForHexRegExp.test(queueValues[0]) == true || propKey == "gender" || propKey == "birthDate"){  // check if field is ObjectId
                            newQuery[propKey] =  queueValues[0];
                        }
                        else{
                            newQuery[propKey] = new RegExp('.*' +  queueValues[0] + '.*', 'i');
                        }
                    }
                    else if(typeof queueValues[0] == 'object'  && Array.isArray(queueValues[0]) && queueValues[0].length > 0){
                        newQuery[propKey] = {$all: queueValues[0]};
                    }
                    else{
                        //console.log(typeof queueValues[0]);
                    }
                }
            }
            catch(e){
                console.log(typeof queueValues[0]);
            }
            queue.shift();
            queueValues.shift();
        }
    }

    return newQuery;

}

exports.list = function(req,res){
      // delete object gender and add string gender
    if(req.query.gender != null && req.query.gender != undefined){
        var gender = "";
        if(typeof req.query.gender == "string"){
            var g = JSON.parse(req.query.gender);
            gender = g._id;
        }
        else if(typeof req.query.gender == "object"){
            gender = req.query.gender._id;
        }

        delete req.query.gender;
        req.query.gender = gender;
    }

    //pagination
    var pageNo = 0, pageSize = 10;
    if (req.query.hasOwnProperty('paginationConfig')) {
        var paginationConfig = JSON.parse(req.query.paginationConfig);
        pageNo = paginationConfig.pageNo - 1;
        pageSize = paginationConfig.pageSize;
        delete req.query.paginationConfig;
    }

    var newRequest = getSearchQuery(req.query);

    Patient.find(newRequest).skip(pageNo * pageSize).limit(pageSize).exec(function (err, patients) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            Patient.find(newRequest).count(function (err, _count) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                }
                else {
                    res.jsonp({list: patients, count: _count});
                }

            });

        }
    });
    /*
    Patient.find(newRequest).populate('_patient').populate('created._user').exec(function (err, patients) {
        if (err) {
            console.log('error');
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            //console.log(patients);
            res.jsonp({list: patients});
        }
    });*/
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
