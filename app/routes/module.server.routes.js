'use strict';
var modules = require('../../app/controllers/module');
var security=require('../../app/controllers/security');
module.exports = function(app) {
	// Routing logic   
	// ...
    app.route('/module/list')
        .get(security.authorizedToDo(['list_roles', 'create_role', 'edit_role', 'view_role']), modules.list);

};