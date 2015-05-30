'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Patient Schema
 */
var PatientSchema = new Schema({
	fullName: {
		type: String,
		default: '',
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
        type: Date,
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
    personalPhoto:{
        type: String,
        trim: true
    },
    created: {
        time: {
            type: Date,
            default: Date.now
        },
        _user: {
            type: Schema.ObjectId,
            ref: 'User'
        }
    },
    updated: {
        time: {
            type: Date
        },
        _user: {
            type: Schema.ObjectId,
            ref: 'User'
        }
    }
});

mongoose.model('Patient', PatientSchema);