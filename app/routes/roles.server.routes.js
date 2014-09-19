'use strict';

module.exports = function(app) {
	var auth = require('../../app/controllers/authentication');
	var roles = require('../../app/controllers/roles');

	// Roles Routes
	app.route('/roles')
		.get(auth.requiresLogin, roles.list)
		.post(auth.requiresLogin, roles.create);

	app.route('/roles/:roleId')
		.get(auth.requiresLogin, roles.read)
		.put(auth.requiresLogin, roles.update)
		.delete(auth.requiresLogin, roles.delete);

	// Finish by binding the Role middleware
	app.param('roleId', roles.roleByID);
};