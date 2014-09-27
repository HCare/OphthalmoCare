'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;


/**
 * Role Schema
 */
var RoleSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill in Role name',
        unique:'There is already a Role with that name',
		trim: true
	},
    _actions:[{
        type:String,
        ref:'Action'
    }],
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

mongoose.model('Role', RoleSchema);