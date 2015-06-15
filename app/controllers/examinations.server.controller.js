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
                        newQuery[propKey] = new RegExp('.*' +  queueValues[0] + '.*', 'i');
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
    console.log(newRequest);

    Examination.find(newRequest).populate('_patient').populate('created._user').exec(function (err, examinations) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            Examination.find(req.query).count(function (err, _count) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                }
                else {
                    //console.log(examinations)
                    res.jsonp({list: examinations, count: _count});
                }

            });

        }
    });

    /*for (var key in req.query) {
        if (req.query.hasOwnProperty(key)) {
            var obj = req.query[key];
            for (var prop in obj) {
                // important check that this is objects own property
                // not from prototype prop inherited
                if(obj.hasOwnProperty(prop)){
                    console.log(prop + " = " + obj[prop]);
                }
            }
        }
    }*/
  /*
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

		//pagination
		var pageNo=0, pageSize=10;
		if(req.query.hasOwnProperty('paginationConfig')){
			var paginationConfig=JSON.parse(req.query.paginationConfig);
			pageNo=paginationConfig.pageNo-1;
			pageSize=paginationConfig.pageSize;
			delete req.query.paginationConfig;
		}

        Examination.find(req.query).skip(pageNo*pageSize).limit(pageSize).exec(function (err, examinations) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
                Examination.find(req.query).count(function(err, _count){
					if (err) {
						return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});
					}
					else{
						res.jsonp({list:examinations, count:_count});
					}

				});

			}
		});
	}
*/


};

/**
 * Examination middleware
 */
exports.examinationByID = function(req, res, next, id) { Examination.findById(id).populate('user', 'displayName').exec(function(err, examination) {
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
