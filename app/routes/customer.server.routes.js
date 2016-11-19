'use strict';

/**
 * Module dependencies
 */
var customer = require('../controllers/customer.server.controller'),
		food = require('../controllers/food.server.controller'),
		users = require('../../app/controllers/users.server.controller');

module.exports = function(app) {
	// Customer routes for user
	app.route('/customer')
		.get(users.requiresLogin, food.list)
		.post(users.requiresLogin, customer.create);
	app.route('/customer/:customerId')
		.get(users.requiresLogin, customer.hasAuthorization, customer.read)
		.put(users.requiresLogin, customer.hasAuthorization, customer.update);

	// Customer routes for admin
	app.route('/admin/customers')
		.get(customer.list);
	app.route('/admin/customers/:customerId')
		.get(customer.read)
		.put(customer.update)
		.delete(customer.delete);

	// Finish by binding the customer middleware
	app.param('customerId', customer.customerById);
};
