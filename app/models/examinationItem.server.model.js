'use strict';

module.exports=function(labels){
    /**
     * Module dependencies.
     */
    var config = require('../../config/config'),
        db = require('seraph')(config.graphDB),
        model = require('seraph-model'),
        examinationItemModel = model(db, 'ExaminationItem'),
        moment=require('moment');

    /**
     * ExaminationItem Schema
     */
    var ExaminationItemSchema = {
        _id:{
            type: String
        },
        _createUser:{
            type: String
        },
        _createTime:{
            type: Number
        },
        _updateUser: {
            type: String
        },
        _updateTime:{
            type: Number
        }
    };

    examinationItemModel.schema = ExaminationItemSchema;
    examinationItemModel.setUniqueKey('_id');
    examinationItemModel.on('beforeSave', function(obj) {
        if(!obj._createTime)
        {
            obj._createTime = moment().valueOf();
        }
        else
        {
            obj._updateTime = moment().valueOf();
        }
    });
    examinationItemModel.on('afterSave', function (obj) {
        if (!obj._updateTime) {
            db.label(obj, labels, function (err) {
            });
        }
    });
    examinationItemModel.delete=db.delete;
    return  examinationItemModel;
}