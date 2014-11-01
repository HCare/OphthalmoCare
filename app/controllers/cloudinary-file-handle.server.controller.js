'use strict';

/**
 * Module dependencies.
 */
var config = require('../../config/config'),
    errorHandler = require('./errors'),
    _ = require('lodash'),
    cloudinary = require('cloudinary');
    cloudinary.config({
        cloud_name: config.cloudinaryCloud,
        api_key: config.cloudinaryKey,
        api_secret: config.cloudinarySecret
    });

exports.uploadFile = function (req, res) {
    var filePath = req.body.filePath;
    var warn = null;
    cloudinary.uploader.upload(req.files.file.path, function (result) {
            if (result) {
                res.jsonp(req.body);
            }
            else {
                warn = {warn: 'File not saved'};
                _.extend(req.body, warn);
                res.jsonp(req.body);
            }
        },
        { public_id: filePath + req.files.file.originalname });

};

exports.responseFile = function (filePath, res) {
    cloudinary.api.resource(filePath,
        function (result) {
            if (result) {
                if (result.error) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(result.error)
                    });
                }
                res.writeHead(302, {'Location': result.url});
                res.end();

            }
            else {
                return res.status(400).send({
                    message: 'Can not find requested file'
                });
            }
        }
    );
}