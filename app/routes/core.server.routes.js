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

	// Template config provider
	app.route('/template-config').get(
		function(req, res) {
			res.send(require('../../template-config.json'));
		}
	);

	// Apply authorization middleware for all admin routes
	app.all('/admin/*', users.hasAuthorization(role));
};
