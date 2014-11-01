'use strict';

module.exports = function(app) {
    var security = require('../../app/controllers/security');
	var roles = require('../../app/controllers/roles');

	// Roles Routes
	app.route('/roles')
		.get(security.authorizedToDo(['list_roles', 'list_users', 'create_user', 'edit_user']), roles.list)
		.post(security.authorizedToDo('create_role'), roles.create);

	app.route('/roles/:roleId')
		.get(security.authorizedToDo('view_role'), roles.read)
		.put(security.authorizedToDo('edit_role'), roles.update)
		.delete(security.authorizedToDo('delete_role'), roles.delete);

	// Finish by binding the Role middleware
	app.param('roleId', roles.roleByID);
};