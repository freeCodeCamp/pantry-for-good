'use strict';

/**
 * Module dependencies
 */
var express = require('express'),
		customer = require('../controllers/customer.server.controller'),
		food = require('../controllers/food.server.controller'),
		users = require('../../app/controllers/users.server.controller');

var customerRouter = express.Router({mergeParams: true});
// Customer routes for user
customerRouter.route('/customer')
	.get(users.requiresLogin, food.list)
	.post(users.requiresLogin, customer.create)
customerRouter.route('/customer/:customerId')
	.get(users.requiresLogin, customer.hasAuthorization, customer.read)
	.put(users.requiresLogin, customer.hasAuthorization, customer.update)

// Customer routes for admin
customerRouter.route('/admin/customers')
	.get(customer.list)
customerRouter.route('/admin/customers/:customerId')
	.get(customer.read)
	.put(customer.update)
	.delete(customer.delete)

// Finish by binding the customer middleware
customerRouter.param('customerId', customer.customerById);

module.exports = customerRouter
