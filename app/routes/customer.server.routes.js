import Router from 'express-promise-router'

import customerController from '../controllers/customer.server.controller'
import foodController from '../controllers/food.server.controller'
import * as userController from '../controllers/users.server.controller'

export default () => {
	const {requiresLogin} = userController
	const {hasAuthorization} = customerController

	const customerRouter = Router({mergeParams: true});

	// Customer routes for user
	customerRouter.route('/customer')
		.get(requiresLogin, foodController.list)
		.post(requiresLogin, customerController.create)

	customerRouter.route('/customer/:customerId')
		.get(requiresLogin, hasAuthorization, customerController.read)
		.put(requiresLogin, hasAuthorization, customerController.update)

	// Customer routes for admin
	customerRouter.route('/admin/customers')
		.get(customerController.list)

	customerRouter.route('/admin/customers/:customerId')
		.get(customerController.read)
		.put(customerController.update)
		.delete(customerController.delete)

	// Finish by binding the customer middleware
	customerRouter.param('customerId', customerController.customerById);

	return customerRouter
}
