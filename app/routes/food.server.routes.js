'use strict';

/**
 * Module dependencies
 */
var express = require('express'),
		food = require('../controllers/food.server.controller');

var foodRouter = express.Router({mergeParams: true});

// Food routes
foodRouter.route('/admin/foods')
	.get(food.list)
	.post(food.create);
foodRouter.route('/admin/foods/:foodId')
	.put(food.update)
	.delete(food.delete);
foodRouter.route('/admin/foods/:foodId/items')
	.post(food.createItem);
foodRouter.route('/admin/foods/:foodId/items/:itemId')
	.put(food.updateItem)
	.delete(food.deleteItem);

// Food routes for user
foodRouter.route('/foods')
	.get(food.list);

// Finish by binding the food middleware
foodRouter.param('foodId', food.foodById);
foodRouter.param('itemId', food.itemById);

module.exports = foodRouter;
