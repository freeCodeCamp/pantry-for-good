'use strict';

/**
 * Module dependencies
 */
var settings = require('../controllers/settings.server.controller');

module.exports = function(app) {
	// Settings routes
	app.route('/api/settings')
		.post(settings.save);
		
	app.route('/api/settings')
		.get(settings.read);
};
