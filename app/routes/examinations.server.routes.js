'use strict';

module.exports = function(app) {
    var security = require('../../app/controllers/security');
	var examinations = require('../../app/controllers/examinations');

	// Examinations Routes
	app.route('/examinations')
		.get(security.authorizedToDo('list_examinations'), examinations.list)
		.post(security.authorizedToDo('create_examination'), examinations.create);

	app.route('/examinations/:examinationId')
		.get(security.authorizedToDo('view_examination'), examinations.read)
		.put(security.authorizedToDo('edit_examination'), examinations.update)
		.delete(security.authorizedToDo('delete_examination'), examinations.delete);


	// Finish by binding the Examination middleware
	app.param('examinationId', examinations.examinationByID);
};
