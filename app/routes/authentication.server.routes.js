'use strict';

var auth = require('../../app/controllers/authentication');

module.exports = function(app) {
	// Routing logic   
	// ...
    app.route('/auth/signin').post(auth.signin);
};