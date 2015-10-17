'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Visit Schema
 */
var VisitSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Visit name',
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

mongoose.model('Visit', VisitSchema);