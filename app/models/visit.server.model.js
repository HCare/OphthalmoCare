'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

/**
 * Visit Schema
 */
var VisitSchema = new Schema({
    type: {
        type: String,
        required: 'Please fill Visit type',
        trim: true
    },
    time: {
        type: Date,
        default: Date.now
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
    _patient: {
        type: Schema.ObjectId,
        ref: 'Patient'
    }
});


VisitSchema.plugin(autoIncrement.plugin, {model: 'Visit', field: 'seq', startAt: 1, incrementBy: 1});

mongoose.model('Visit', VisitSchema);
