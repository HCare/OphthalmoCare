'use strict';

module.exports = function(app) {
    var security = require('../../app/controllers/security');
	var visits = require('../../app/controllers/visits');

	// Visits Routes
	app.route('/visits')
		.get(security.authorizedToDo('list_visits'), visits.list)
		.post(security.authorizedToDo('create_visit'), visits.create);

	app.route('/visits/:visitId')
		.get(security.authorizedToDo('view_visit'), visits.read)
		.put(security.authorizedToDo('edit_visit'), visits.update)
		.delete(security.authorizedToDo('delete_visit'), visits.delete);

	// Finish by binding the Visit middleware
	app.param('visitId', visits.visitByID);
};