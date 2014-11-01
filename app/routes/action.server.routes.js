'use strict';

var action = require('../../app/controllers/action');
var security=require('../../app/controllers/security');
module.exports = function(app) {
	// Routing logic   
	// ...
    app.route('/action/list')
        .get(security.requiresLogin, action.list);
};