'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Food = mongoose.model('Food'),
	Customer = mongoose.model('Customer'),
	_ = require('lodash'),
	async = require('async');

/**
 * Create a Food category
 */
exports.create = function(req, res) {
	var food = new Food(req.body);

	food.save(function(err){
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(food);
		}
	});
};

/**
 * Update a Food category
 */
exports.update = function(req, res) {
	var food = req.food;

	food = _.extend(food, req.body);

	food.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(food);
		}
	});
};

/**
 * Delete a Food category
 */
exports.delete = function(req, res) {
	var food = req.food;

	// Prevent remove if food category contains food items
	if (food.items.length) {
		return res.status(400).send({
			message: 'Food category must be empty before deleting'
		});
	}

	food.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(food);
		}
	});
};

/**
 * List of Food categories
 */
exports.list = function(req, res) {
	Food.find().sort('category').exec(function(err, foods) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(foods);
		}
	});
};

/**
 * Create a food item
 */
exports.createItem = function(req, res) {
	var id = req.food._id;
	var item = req.body;
	
	item._id = mongoose.Types.ObjectId(item._id);

	Food.findByIdAndUpdate(id, {$addToSet: {items: item}}, function(err, food) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(food);
		}
	});

	// Add item to every customer's food preferences
	Customer.update({}, {$addToSet: {foodPreferences: item._id}}, {multi: true}, function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
	});
};

/**
 * Update a food item
 */
exports.updateItem = function(req, res) {
	var id = req.food._id;
	var item = req.body;

	async.waterfall([
		function(done) {
			Food.findOneAndUpdate({_id: id, 'items._id': item._id}, {$set: {'items.$': item}}, function(err, food) {
				if (!food) {
					// No document found which means the food item has changed category, go on with the waterfall
					done(err);
				} else {
					// Regular update and document is found, exit the waterfall
					return res.json(food);
				}
			});
		},
		function(done) {
			// Add food item to the new food category
			Food.findByIdAndUpdate(id, {$addToSet: {items: item}}, function(err, food) {
				done(err, food);
			});
		},
		function(food, done) {
			// Remove food item from the old food category
			Food.findByIdAndUpdate(item.categoryIdOld, {$pull: {items: {_id: item._id}}}, function(err) {
				done(err, food);
			});
		}
	], function(err, food) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(food);
		}
	});
};

/**
 * Delete a food item
 */
exports.deleteItem = function(req, res) {
	var id = req.food._id;

	Food.findByIdAndUpdate(id, {$pull: {items: {_id: req.itemId}}}, function(err, food) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(food);
		}
	});
};

/**
 * Food middleware
 */
exports.foodById = function(req, res, next, id) {
	Food.findById(id).exec(function(err, food) {
		if (err) return next(err);
		if (!food) {
			return res.status(404).send({
				message: 'Food category not found'
			});
		}
		req.food = food;
		next();
	});
};

exports.itemById = function(req, res, next, id) {
	req.itemId = id;
	next();
};
