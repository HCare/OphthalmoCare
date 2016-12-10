'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;


/**
 * Examination Schema
 */
var ExaminationSchema = new Schema({
    oculusDexter:{
            appearance: Array,
            eyeLid: Array,
            lacrimalSystem:Array,
            conjunctiva: Array,
            sclera: Array,
            cornea: Array,
            anteriorChamber: Array,
            iris: Array,
            pupil: Array,
            lens: Array,
            fundus: Array,
            opticNerve: Array,
            va: String,
            eom: Array,
            bcva:String,
            bcvaWith: String,
            iop: String
        },
    oculusSinister:{
            appearance: Array,
            eyeLid: Array,
            lacrimalSystem: Array,
            conjunctiva: Array,
            sclera: Array,
            cornea: Array,
            anteriorChamber: Array,
            iris: Array,
            pupil: Array,
            lens: Array,
            fundus: Array,
            opticNerve: Array,
            va: String,
            eom: Array,
            bcva:String,
            bcvaWith: String,
            iop: String
        },
    comment: {
        type: String
    },
    commentsImageData:{
        type: String
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
	},
    _patient:{type: Schema.ObjectId,
        ref: 'Patient'}
});

mongoose.model('Examination', ExaminationSchema);