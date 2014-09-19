'use strict';
var modules = require('../../app/controllers/module');

module.exports = function(app) {
	// Routing logic   
	// ...
    app.route('/module/list')
        .get(modules.list);

};