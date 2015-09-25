'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

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

PatientSchema.plugin(autoIncrement.plugin, { model: 'Patient', field: 'seq', startAt: 1, incrementBy: 1 });

mongoose.model('Patient', PatientSchema);