'use strict';

module.exports = function(app) {
    var security = require('../../app/controllers/security');
	var patients = require('../../app/controllers/patients');

	// Patients Routes
	app.route('/patients')
		.get(security.authorizedToDo('list_patients'), patients.list)
		.post(security.authorizedToDo('create_patient'), patients.create);

	app.route('/patients/:patientId')
		.get(security.authorizedToDo('view_patient'), patients.read)
		.put(security.authorizedToDo('edit_patient'), patients.update)
		.delete(security.authorizedToDo('delete_patient'), patients.delete);

	// Finish by binding the Patient middleware
	app.param('patientId', patients.patientByID);
};