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
    //console.log(patient);
    var hasPhoto = patient.personalPhoto;
    if (hasPhoto === 'true') {
        patient.personalPhoto = config.patientPhotoFileName;
    }
    //console.log(hasPhoto);
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

    console.log(property);

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
                        //console.log("*********************" + propKey);
                        newQuery[propKey] = {$all: propValue};
                    }
                    else if(typeof propValue == 'object'){  // Object
                        //console.log("*********************" + propKey);
                        if(propValue.hasOwnProperty('__range'))
                        {
                            //console.log("range range range range range range range range range");
                            var range = propValue["__range"];
                            var arr= range.split(":");
                            var part1=  arr[0];
                            var part2=  arr[1];
                            console.log(part1);
                            console.log(part2);


                            if(part1 != null && part1.length >0 && part2 != null && part2.length >0)
                            {
                                newQuery[propKey] = { $gte: part1, $lte: part2 };
                            }
                            else if(part1 != null && part1.length > 0 && part2 != null && part2.length == 0)
                            {
                                newQuery[propKey] = { $gte: part1};
                            }
                            else if(part1 != null && part1.length == 0 && part2 != null && part2.length > 0)
                            {
                                newQuery[propKey] = {$lte: part2 };
                            }
                        }
                        else{
                            for(var k in propValue){
                                //console.log("*********************" + k);
                                queue.push(propKey + "." + k);
                                queueValues.push(propValue[k]);
                            }
                        }
                    }
                    else if(typeof propValue == "number"){
                        newQuery[propKey] = new RegExp('.*' +  propValue + '.*', 'i');
                    }
                }
                catch(e){  // string && empty array && Already sent as array
                    if(typeof queueValues[0] == 'string'){
                        //console.log("*********************" + propKey);
                        var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
                        if(checkForHexRegExp.test(queueValues[0]) == true || propKey == "gender" || propKey == "birthDate"){  // check if field is ObjectId
                            newQuery[propKey] =  queueValues[0];
                        }
                        else{
                            //console.log("*********************" + propKey);
                            newQuery[propKey] = new RegExp('.*' +  queueValues[0] + '.*', 'i');
                        }
                    }
                    else if(typeof queueValues[0] == 'object'  && Array.isArray(queueValues[0]) && queueValues[0].length > 0){
                        //console.log("*********************" + propKey);
                        newQuery[propKey] = {$all: queueValues[0]};
                    }
                    else{
                        //console.log(typeof queueValues[0]);
                        //console.log(queueValues[0]);
                        //console.log("*********************" + propKey);

                        /*for(var k in queueValues[0]){
                            console.log("*********************" + k);
                            queue.push(propKey + "." + k);
                            queueValues.push(propValue[k]);
                        }*/

                        if(queueValues[0].hasOwnProperty('__range'))
                        {
                            //console.log("range range range range range range range range range");
                            var range = queueValues[0]["__range"];
                            var arr= range.split(":");
                            var part1=  arr[0];
                            var part2=  arr[1];
                            console.log(part1);
                            console.log(typeof part1);
                            console.log(part2);
                            console.log(typeof part2);
                            if(part1 != null && part1.length >0 && part2 != null && part2.length >0)
                            {
                                 newQuery[queue[0]] = { $gte: part1, $lte: part2 };
                            }
                            else if(part1 != null && part1.length > 0 && part2 != null && part2.length == 0)
                            {
                                newQuery[queue[0]] = { $gte: part1};
                            }
                            else if(part1 != null && part1.length == 0 && part2 != null && part2.length > 0)
                            {
                                newQuery[queue[0]] = {$lte: part2 };
                            }
                        }
                        else{
                            for(var k in queueValues[0]){
                                console.log("*********************" + k);
                                queue.push(queue[0] + "." + k);
                                queueValues.push(queueValues[0][k]);
                            }
                        }
                    }
                }
            }
            catch(e){
                //console.log("*********************" + propKey);
                console.log(typeof queueValues[0]);
            }
            queue.shift();
            queueValues.shift();
        }
    }

    console.log(newQuery);
    return newQuery;

}

exports.list = function(req,res){
    if(typeof req.query.searchObj=="string"){
        req.query.searchObj=JSON.parse(req.query.searchObj);
    }
    //pagination
    var pageNo = 0, pageSize = 10;
    if (req.query.hasOwnProperty('paginationObj')) {
        var paginationConfig = JSON.parse(req.query.paginationObj);
        pageNo = paginationConfig.pageNo - 1;
        pageSize = paginationConfig.pageSize;
        delete req.query.paginationObj;
    }

    var newRequest = getSearchQuery(req.query.searchObj);

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
