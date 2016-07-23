'use strict';

module.exports = function(app) {
    var security = require('../../app/controllers/security');
    var complaints = require('../../app/controllers/complaints');

	// Complaints Routes
	app.route('/complaints')
		.get(security.authorizedToDo('list_complaints'), complaints.list)
		.post(security.authorizedToDo('create_complaint'), complaints.create);

	app.route('/complaints/:complaintId')
		.get(security.authorizedToDo('view_complaint'), complaints.read)
		.put(security.authorizedToDo('edit_complaint'), complaints.update)
		.delete(security.authorizedToDo('delete_complaint'), complaints.delete);

	// Finish by binding the Complaint middleware
	app.param('complaintId', complaints.complaintByID);
};