'use strict';

/**
 * Module dependencies
 */
var driver = require('../controllers/driver.server.controller');

module.exports = function(app) {
	// Driver routes for google map and clusterer
	app.route('/donor')
		.get(driver.getGoogleMapObject);



};
