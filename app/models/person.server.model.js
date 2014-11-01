'use strict';

/**
 * Module dependencies.
 */
var config = require('../../config/config'),
    db = require('seraph')(config.graphDB),
    model = require('seraph-model'),
    personModel = model(db, 'Person'),
    moment=require('moment');


/**
 * Person Schema
 */
var PersonSchema = {
    fullName: {
        type: String,
        required: 'Please fill Patient name',
        trim: true
    },
    gender: {
        type: String,
        required: 'Please fill Patient gender',
        trim: true,
        enum: ['male', 'female']
    },
    birthDate: {
        type: Date
        //required: 'Please fill Patient birth date'
    },
    tel: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        match: /.+\@.+\..+/
    },
    notes: {
        type: String
    },
    _createdUser:{
        type:String
    },
    _createdTime:{
        type:Date,
        default: moment()
    },
    _updatedUser: {
        type:String
    },
    _updatedDate:{
        type:Date
    }
};

personModel.schema = PersonSchema;
/*patientModel.addComputedField(function (patient) {
 return patient.birthDate - Date.now;
 });*/

exports.db = db;
exports.Person = personModel;