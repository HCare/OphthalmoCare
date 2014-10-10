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
        ref:'Action',
        required: 'Please select actions'
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

RoleSchema.path('_actions').validate(function (value) {
    return value.length > 0;
}, 'Please select actions');

mongoose.model('Role', RoleSchema);