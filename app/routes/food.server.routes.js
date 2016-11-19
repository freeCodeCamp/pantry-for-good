'use strict';

/**
 * Module dependencies
 */
var food = require('../controllers/food.server.controller');

module.exports = function(app) {
	// Food routes
	app.route('/admin/foods')
		.get(food.list)
		.post(food.create);
	app.route('/admin/foods/:foodId')
		.put(food.update)
		.delete(food.delete);
	app.route('/admin/foods/:foodId/items')
		.post(food.createItem);
	app.route('/admin/foods/:foodId/items/:itemId')
		.put(food.updateItem)
		.delete(food.deleteItem);

	// Finish by binding the food middleware
	app.param('foodId', food.foodById);
	app.param('itemId', food.itemById);
};
