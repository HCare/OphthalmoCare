'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Examination = mongoose.model('Examination'),
	_ = require('lodash');

/**
 * Create a Examination
 */
exports.create = function(req, res) {
    //console.log(req.body);
	var examination = new Examination(req.body);
	examination.created._user = req.user;
    //console.log(examination);
	examination.save(function(err) {
        //console.log(err);
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
 * Show the current Examination
 */
exports.read = function(req, res) {
	res.jsonp(req.examination);
};

/**
 * Update a Examination
 */
exports.update = function(req, res) {
	var examination = req.examination ;
    examination.updated._user = req.user;
    examination.updated.time = new Date();
	examination = _.extend(examination , req.body);
    //console.log(examination);
	examination.save(function(err) {
		if (err) {
            //console.log(err);
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
exports.delete = function(req, res) {
	var examination = req.examination ;

	examination.remove(function(err) {
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
exports.list = function(req, res) { Examination.find().sort('-created').populate('created._user', 'displayName').populate('_patient', 'fullName').exec(function(err, examinations) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(examinations);
		}
	});
};

function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function convertJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return JSON.parse(str);
}

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
                    else{  // Object
                        for(var k in propValue){
                            queue.push(propKey + "." + k);
                            queueValues.push(propValue[k]);
                        }
                    }
                }
                catch(e){  // string && empty array && Already sent as array
                    if(typeof queueValues[0] == 'string'){
                        var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
                        if(checkForHexRegExp.test(queueValues[0]) == true){  // check if field is ObjectId
                            newQuery[propKey] =  queueValues[0];
                        }
                        else{
                            newQuery[propKey] = new RegExp('.*' +  queueValues[0] + '.*', 'i');
                        }


                    }
                    if(typeof queueValues[0] == 'object'  && Array.isArray(queueValues[0]) && queueValues[0].length > 0){
                        newQuery[propKey] = {$all: queueValues[0]};
                    }
                }
            }
            catch(e){
            }
            queue.shift();
            queueValues.shift();
        }
    }

    return newQuery;

}




/**
 * Search of Examinations
 */
exports.search = function(req,res){
    console.log("***********************************");
    console.log("returned Req.Query");
    var newRequest = getSearchQuery(req.query);
    //console.log(newRequest);
    //var obj = { _patient: '556a015c3cc50f7012217693'};
    Examination.find(newRequest).populate('_patient').populate('created._user').exec(function (err, examinations) {
        if (err) {
            console.log('error');
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            /*Examination.find(req.query).count(function (err, _count) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                }
                else {
                    console.log(examinations);
                    res.jsonp({list: examinations, count: _count});
                }

            });*/
            console.log(examinations);
            //console.log(_count);
            //res.jsonp({list: examinations, count: _count});
            res.jsonp({list: examinations});
        }
    });
};

/**
 * Examination middleware
 */
exports.examinationByID = function(req, res, next, id) { Examination.findById(id).populate('user', 'displayName').populate('_patient', 'fullName').exec(function(err, examination) {
		if (err) return next(err);
		if (! examination) return next(new Error('Failed to load Examination ' + id));
		req.examination = examination ;
		next();
	});
};

/**
 * Examination authorization middleware
 */
/*
exports.hasAuthorization = function(req, res, next) {
	if (req.examination.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
    */
