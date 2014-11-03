'use strict';

/**
 * Module dependencies.
 */
var	config = require('../../config/config'),
    errorHandler = require('./errors'),
    _ = require('lodash'),
    path=require('path'),
    fs=require('fs'),
    mime = require('mime-types'),
    filesRoot=config.filesUpload;


var saveFile=function(file, filePath, callback){
    fs.rename(file.path, filesRoot + filePath + config.patientPhotoFileName , function(err) {
        if(err){
            callback(err);
        }
        else{
            callback();
        }
    });
}

var createDir=function(filePath, callback, position) {
    var parts = path.normalize(filePath).split(path.sep);
    console.log(parts);
    var rootDir = path.normalize(filesRoot);
    position = position || 0;
    if (position >= parts.length) {
        return callback();
    }
    var directory = rootDir+parts.slice(0, position + 1).join(path.sep) || path.sep;
    console.log(directory);
    fs.stat(directory, function(err) {
        if (err === null) {
            createDir(filePath, callback, position + 1);
        } else {
            fs.mkdir(directory, function(err) {
                if (err && err.code !== 'EEXIST') {
                    return callback(err);
                } else {
                    createDir(filePath, callback, position + 1);
                }
            });
        }
    });
};

exports.uploadFile=function(req, res){
    var filePath = req.body.filePath;
    var warn=null;
    fs.exists(filesRoot+filePath, function(exist){
       if(!exist){
           createDir(filePath, function(err) {
               if(err){
                   warn={warn:errorHandler.getErrorMessage(err)};
                   _.extend(req.body, warn);
                   res.jsonp(req.body);
                   return;
               }
               saveFile(req.files.file, filePath, function(err) {
                   if(err){
                       warn={warn:errorHandler.getErrorMessage(err)};
                       _.extend(req.body, warn);
                       res.jsonp(req.body);
                       return;
                   }
                   res.jsonp(req.body);
               });
           });
       }
        else{
           saveFile(req.files.file, filePath, function(err) {
               if(err){
                   warn={warn:errorHandler.getErrorMessage(err)};
                   _.extend(req.body, warn);
                   res.jsonp(req.body);
                   return;
               }
               res.jsonp(req.body);
           });
       }
    });
};

exports.responseFile=function(filePath, res){
    fs.readFile(filesRoot+filePath, function(err, data){
        if(err){
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        var fileType=mime.lookup(filesRoot+filePath);
        res.writeHead(200, {'Content-Type': fileType});
        res.write(data);
        res.end();
    });
}
