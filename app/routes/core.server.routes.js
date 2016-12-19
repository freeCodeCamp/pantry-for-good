'use strict';

/**
 * Module dependencies
 */
var core = require('../../app/controllers/core.server.controller'),
		users = require('../../app/controllers/users.server.controller'),
		role = ['admin'];

module.exports = function(app) {
	// Root routing
	app.route('/').get(core.index);

	// Apply authorization middleware for all admin routes
	app.all('/admin/*', users.hasAuthorization(role));
};
