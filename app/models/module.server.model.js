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
Module.findOneAndUpdate({_id: 'roles'}, {name: 'Roles', order: 0}, {upsert: true}, function (err) {
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

///Patients Module..
Module.findOneAndUpdate({_id: 'patients'}, {name: 'Patients', order:2}, {upsert: true}, function (err) {
    if (err) {
        console.log('Error Creating "Patients" Module: ' + JSON.stringify(err));
        return;
    }
});

///Medical-Histories Module..
Module.findOneAndUpdate({_id: 'medical-histories'}, {name: 'Medical Histories', order:3}, {upsert: true}, function (err) {
    if (err) {
        console.log('Error Creating "Medical Histories" Module: ' + JSON.stringify(err));
        return;
    }
});


///Visits Module..
Module.findOneAndUpdate({_id: 'visits'}, {name: 'Visits', order:4}, {upsert: true}, function (err) {
    if (err) {
        console.log('Error Creating "Visits" Module: ' + JSON.stringify(err));
        return;
    }
});

///Complaints Module..
Module.findOneAndUpdate({_id: 'complaints'}, {name: 'Complaints', order:5}, {upsert: true}, function (err) {
    if (err) {
        console.log('Error Creating "Complaints" Module: ' + JSON.stringify(err));
        return;
    }
});

///Examinations Module..
Module.findOneAndUpdate({_id: 'examinations'}, {name: 'Examinations', order:6}, {upsert: true}, function (err) {
    if (err) {
        console.log('Error Creating "Examinations" Module: ' + JSON.stringify(err));
        return;
    }
});


