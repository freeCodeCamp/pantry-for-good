'use strict';

/**
 * Module dependencies
 */
var volunteer = require('../controllers/volunteer.server.controller'),
		users = require('../../app/controllers/users.server.controller');

module.exports = function(app) {
	// Volunteer routes for user
	app.route('/volunteer')
		.post(users.requiresLogin, volunteer.create);
	app.route('/volunteer/:volunteerId')
		.get(users.requiresLogin, volunteer.hasAuthorization, volunteer.read)
		.put(users.requiresLogin, volunteer.hasAuthorization, volunteer.update);

	app.route('/driver/delivered')
	   .put(volunteer.sendPackage);

	// Volunteer routes for admin
	app.route('/admin/volunteers')
		.get(volunteer.list);
	app.route('/admin/volunteers/:volunteerId')
		.get(volunteer.read)
		.put(volunteer.update)
		.delete(volunteer.delete);

	// Finish by binding the volunteer middleware
	app.param('volunteerId', volunteer.volunteerById);
};
