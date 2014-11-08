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
	name: {
		type: String,
		default: '',
		required: 'Please fill Examination name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Examination', ExaminationSchema);