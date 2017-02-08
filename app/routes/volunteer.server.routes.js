'use strict';

/**
 * Module dependencies
 */
var express = require('express'),
		volunteer = require('../controllers/volunteer.server.controller'),
		users = require('../../app/controllers/users.server.controller');

var volunteerRouter = express.Router({mergeParams: true});
// Volunteer routes for user
volunteerRouter.route('/volunteer')
	.post(users.requiresLogin, volunteer.create);
volunteerRouter.route('/volunteer/:volunteerId')
	.get(users.requiresLogin, volunteer.hasAuthorization, volunteer.read)
	.put(users.requiresLogin, volunteer.hasAuthorization, volunteer.update);

// Volunteer routes for admin
volunteerRouter.route('/admin/volunteers')
	.get(volunteer.list);
volunteerRouter.route('/admin/volunteers/:volunteerId')
	.get(volunteer.read)
	.put(volunteer.update)
	.delete(volunteer.delete);

// Finish by binding the volunteer middleware
volunteerRouter.param('volunteerId', volunteer.volunteerById);

module.exports = volunteerRouter;
