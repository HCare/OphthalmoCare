'use strict';

var action = require('../../app/controllers/action');

module.exports = function(app) {
	// Routing logic   
	// ...
    app.route('/action/list')
        .get(action.list);
};