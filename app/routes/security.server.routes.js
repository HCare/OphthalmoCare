'use strict';

module.exports = function(app) {
	//var users = require('../../app/controllers/users');
	var security = require('../../app/controllers/security');

    app.route('/auth/signin').post(security.signin);
    app.route('/auth/signout').get(security.signout);
    app.route('/auth/is-authorized/:actionId').get(security.authorizedToDo(), security.authorized);

	// Security Routes
//	app.route('/authenticate')
//		.get(security.isAuthenticated);

	/*app.route('/security/:actionId')
		.get(securities.read)
		.put(users.requiresLogin, securities.hasAuthorization, securities.update)
		.delete(users.requiresLogin, securities.hasAuthorization, securities.delete);*/

	// Finish by binding the Security middleware
//	app.param('actionId', securities.securityByID);
};