'use strict';

module.exports = function(app) {
    var config = require('../../config/config'),
        security = require('../../app/controllers/security'),
	    patients = require('../../app/controllers/patients'),
        multer =require('multer'),
        fileHandler =require('../../app/controllers/'+config.fileHandler+'-file-handle'),
        multerTemp=multer({ dest: config.filesTemp, limits: {
        fieldNameSize: 255,
            fields: 7,
            files: 1,
            fileSize:100000
    }});

	// Patients Routes
	/*app.route('/patients')
		.get(security.authorizedToDo('list_patients'), patients.search)
		.post(security.authorizedToDo('create_patient'), multerTemp, patients.create, fileHandler.uploadFile);*/

    app.route('/patients')
        .get(security.authorizedToDo('list_patients'), patients.list)
        .post(security.authorizedToDo('create_patient'), multerTemp, patients.create, fileHandler.uploadFile);

    app.route('/patients/search')
        .get(security.authorizedToDo('list_patients'), patients.search)

/*    app.route('/patients/search')
        .get(security.authorizedToDo('list_patients'), patients.search);*/

	app.route('/patients/:patientId')
		.get(security.authorizedToDo('view_patient'), patients.read)
		.put(security.authorizedToDo('edit_patient'), multerTemp, patients.update, fileHandler.uploadFile)
		.delete(security.authorizedToDo('delete_patient'), patients.delete);



    app.route('/patients/personal-photo/:patientId')
        .get(security.authorizedToDo(['list_patients', 'create_patient', 'edit_patient', 'view_patient']), patients.renderPhoto);

	// Finish by binding the Patient middleware
	app.param('patientId', patients.patientByID);
};
