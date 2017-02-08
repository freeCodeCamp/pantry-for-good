'use strict';
var express = require('express');

/**
 * Module dependencies
 */
var	users = require('../../app/controllers/users.server.controller'),
		role = ['admin'],
		customerRoutes = require('./customer.server.routes'),
		donationRoutes = require('./donation.server.routes'),
		donorRoutes = require('./donor.server.routes'),
		foodRoutes = require('./food.server.routes'),
		mediaRoutes = require('./media.server.routes'),
		questionnaireRoutes = require('./questionnaire.server.routes'),
		settingsRoutes = require('./settings.server.routes'),
		usersRoutes = require('./users.server.routes'),
		volunteerRoutes = require('./volunteer.server.routes');

var apiRouter = express.Router();

module.exports = apiRouter
	.use(customerRoutes)
	.use(donationRoutes)
	.use(donorRoutes)
	.use(foodRoutes)
	.use(mediaRoutes)
	.use(questionnaireRoutes)
	.use(settingsRoutes)
	.use(usersRoutes)
	.use(volunteerRoutes)
	.all('/admin/*', users.hasAuthorization(role));
