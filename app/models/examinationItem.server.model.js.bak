'use strict';

module.exports = function (labels, generateId) {
    /**
     * Module dependencies.
     */
    var config = require('../../config/config'),
        db = require('seraph')(config.graphDB),
        model = require('seraph-model'),
        examinationItemModel = model(db, labels[0]),
        mongoose = require('mongoose'),
        ObjectId = mongoose.Types.ObjectId,
        moment = require('moment');

    /**
     * examinationItem Schema
     */
    var examinationItemSchema = {
        _id: {
            type: String
        },
        _createUser: {
            type: String
        },
        _createTime: {
            type: Number
        },
        _updateUser: {
            type: String
        },
        _updateTime: {
            type: Number
        }
    };

    examinationItemModel.schema = examinationItemSchema;
    examinationItemModel.setUniqueKey('_id');
    examinationItemModel.on('beforeSave', function (obj) {
        if (!obj._createTime) {
            obj._createTime = moment().valueOf();
            if (generateId) {
                obj._id = new ObjectId();
            }
        }
        else {
            obj._updateTime = moment().valueOf();
        }
    });
    examinationItemModel.on('afterSave', function (obj) {
        if (!obj._updateTime) {
            if (labels.length > 1) {
                db.label(obj, labels.slice(1), function (err) {
                });
            }
        }
    });
    examinationItemModel.delete = db.delete;
    return  examinationItemModel;
}