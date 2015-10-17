'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Medical history Schema
 */
var MedicalHistorySchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Medical history name',
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

mongoose.model('MedicalHistory', MedicalHistorySchema);