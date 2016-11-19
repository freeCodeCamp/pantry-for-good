'use strict';

/**
 * Module dependencies
 */
var donation = require('../controllers/donation.server.controller');

module.exports = function(app) {
	// Donation routes for admin
	app.route('/admin/donations')
		.post(donation.create);
		
	app.route('/admin/donations/:donorId')
		.put(donation.sendEmail);
};
