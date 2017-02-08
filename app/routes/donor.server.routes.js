'use strict';

/**
 * Module dependencies
 */
var express = require('express'),
		donor = require('../controllers/donor.server.controller'),
		users = require('../../app/controllers/users.server.controller');

var donorRouter = express.Router({mergeParams: true});

// Donor routes for users
donorRouter.route('/donor')
	.post(users.requiresLogin, donor.create);
donorRouter.route('/donor/:donorId')
	.get(users.requiresLogin, donor.hasAuthorization, donor.read)
	.put(users.requiresLogin, donor.hasAuthorization, donor.update);

// Donor routes for admin
donorRouter.route('/admin/donors')
	.get(donor.list);
donorRouter.route('/admin/donors/:donorId')
	.get(donor.read)
	.put(donor.update)
	.delete(donor.delete);

// Finish by binding the donor middleware
donorRouter.param('donorId', donor.donorById);

module.exports = donorRouter;
