'use strict';

/**
 * Module dependencies
 */
var media = require('../controllers/media.server.controller');

module.exports = function(app) {
	// Settings routes
	app.route('/api/media')
		.post(media.save);
		
	app.route('/api/media')
		.get(media.read);
};
