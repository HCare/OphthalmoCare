'use strict';

module.exports = function(app) {
    var config = require('../../config/config'),
        security = require('../../app/controllers/security'),
	    patients = require('../../app/controllers/patients'),
        multer =require('multer'),
        fileHandler =require('../../app/controllers/file-handle'),
        multerTemp=multer({ dest: config.filesTemp, limits: {
        fieldNameSize: 255,
            fields: 7,
            files: 1,
            fileSize:100000
    }});

	// Patients Routes
	app.route('/patients')
		.get(security.authorizedToDo('list_patients'), patients.list)
		.post(security.authorizedToDo('create_patient'), multerTemp, patients.create, fileHandler.uploadFile);

	app.route('/patients/:patientId')
		.get(security.authorizedToDo('view_patient'), patients.read)
		.put(security.authorizedToDo('edit_patient'), patients.update)
		.delete(security.authorizedToDo('delete_patient'), patients.delete);

    app.route('/patients/personal-photo/:patientId')
        .get(security.authorizedToDo('view_patient'), patients.renderPhoto);

	// Finish by binding the Patient middleware
	app.param('patientId', patients.patientByID);
};