'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Module Schema
 */
var ModuleSchema = new Schema({
    // Module model fields
    // ...
    _id: String,
    name: {
        type: String,
        default: '',
        required: 'Please fill Module name',
        unique: 'There is already a Module with that name',
        trim: true
    },
    order: {
        type: Number
    }
});

/**register mongoose module*/
var Module = mongoose.model('Module', ModuleSchema);

/**Init Module data*/
///Roles Module..
Module.findOneAndUpdate({_id: 'roles'}, {name: 'Roles', order: 2}, {upsert: true}, function (err) {
    if (err) {
        console.log('Error Creating "Roles" Module' + JSON.stringify(err));
        return;
    }
});
///Users Module..
Module.findOneAndUpdate({_id: 'users'}, {name: 'Users', order:1}, {upsert: true}, function (err) {
    if (err) {
        console.log('Error Creating "Users" Module: ' + JSON.stringify(err));
        return;
    }
});