'use strict';

/**
 * Module dependencies.
 */
var config = require('../../config/config'),
    db = require('seraph')(config.graphDB),
    model = require('seraph-model'),
    personModel = model(db, 'Person'),
    mongoose = require('mongoose'),
    ObjectId = mongoose.Types.ObjectId,
    moment=require('moment');


/**
 * Person Schema
 */
var PersonSchema = {
    _id:{
        type: String,
        default:new ObjectId()
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
    _createUser:{
        type: String
    },
    _createTime:{
        type: Number
    },
    _updateUser: {
        type: String
    },
    _updateTime:{
        type: Number
    }
};

personModel.schema = PersonSchema;


exports.db = db;
exports.Person = personModel;