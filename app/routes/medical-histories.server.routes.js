'use strict';

module.exports = function(app) {
    var security = require('../../app/controllers/security');
	var medicalHistories = require('../../app/controllers/medical-histories');

	// Medical histories Routes
	app.route('/medical-histories')
		.get(security.authorizedToDo('list_medical-histories'), medicalHistories.list)
		.post(security.authorizedToDo('create_medical-history'), medicalHistories.create);

	app.route('/medical-histories/:medicalHistoryId')
		.get(security.authorizedToDo('view_medical-history'), medicalHistories.read)
		.put(security.authorizedToDo('edit_medical-history'), medicalHistories.update)
		.delete(security.authorizedToDo('delete_medical-history'), medicalHistories.delete);

	// Finish by binding the Medical history middleware
	app.param('medicalHistoryId', medicalHistories.medicalHistoryByID);
};