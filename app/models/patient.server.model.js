'use strict';

/**
 * Module dependencies.
 */
var config = require('../../config/config'),
    db = require('seraph')(config.graphDB),
    model = require('seraph-model'),
    patientModel = model(db, 'Patient'),
    mongoose = require('mongoose'),
    ObjectId = mongoose.Types.ObjectId,
    moment = require('moment');


/**
 * Patient Schema
 */
var PatientSchema = {
    _id: {
        type: String,
        default: 'xxxxxxxxxxxxxxxxxxxxxxxx'
    },
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
        type: Number,
        required: 'Please fill Patient birth date'
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
    _createUser: {
        type: String
    },
    _createTime: {
        type: Number
    },
    _updateUser: {
        type: String
    },
    _updateTime: {
        type: Number
    }
};

patientModel.schema = PatientSchema;
//patientModel.setUniqueKey('_id');
patientModel.on('beforeSave', function (obj) {
    if (obj._id === 'xxxxxxxxxxxxxxxxxxxxxxxx') {
        obj._id = new ObjectId();
        obj._createTime = moment().valueOf();
    }
    else {
        obj._updateTime = moment().valueOf();
    }
});
patientModel.on('afterSave', function (obj) {
    if (!obj._updateTime) {
        db.label(obj, ['Person'], function (err) {
        });
    }
});

exports.db = db;
exports.Patient = patientModel;