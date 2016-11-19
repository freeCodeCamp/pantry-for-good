'use strict';

/**
 * Module dependencies
 */
var donor = require('../controllers/donor.server.controller'),
		users = require('../../app/controllers/users.server.controller');

module.exports = function(app) {
	// Donor routes for users
	app.route('/donor')
		.post(users.requiresLogin, donor.create);
	app.route('/donor/:donorId')
		.get(users.requiresLogin, donor.hasAuthorization, donor.read)
		.put(users.requiresLogin, donor.hasAuthorization, donor.update);

	// Donor routes for admin
	app.route('/admin/donors')
		.get(donor.list);
	app.route('/admin/donors/:donorId')
		.get(donor.read)
		.put(donor.update)
		.delete(donor.delete);

	// Finish by binding the donor middleware
	app.param('donorId', donor.donorById);
};
