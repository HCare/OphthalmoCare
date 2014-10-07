'use strict';

module.exports = function(app) {
    var security = require('../../app/controllers/security');
	var manageUsers = require('../../app/controllers/manage-users');

	// Manage users Routes
	app.route('/manage-users')
		.get(security.authorizedToDo('list_users'),manageUsers.list)
		.post(security.authorizedToDo('create_user'), manageUsers.create);

	app.route('/manage-users/:manageUserId')
		.get(security.authorizedToDo('list_users'), manageUsers.read)
		.put(security.authorizedToDo('edit_user'), manageUsers.update)
		.delete(security.authorizedToDo('delete_user'), manageUsers.delete);

	// Finish by binding the Manage user middleware
	app.param('manageUserId', manageUsers.manageUserByID);
};