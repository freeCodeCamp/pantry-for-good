(function() {
	'use strict';

	angular.module('food').controller('FoodController', FoodController);

	/* @ngInject */
	function FoodController(Food, FoodItem) {
		var self = this;

		// Copy food item for smart table
		self.itemsCopy = [].concat(self.items);

		// Add plugins into datatable
		self.dtOptions =
		{
			dom: 'Tlrtip',
			tableTools: {
				sSwfPath: '/lib/datatables-tabletools/swf/copy_csv_xls.swf',
				aButtons: [
					"copy",
					{
						"sExtends":    "collection",
						"sButtonText": "Save",
						"aButtons":    [ {
							"sExtends": "csv",
							"sButtonText": "CSV",
							"mColumns": [ 0, 1, 2 ],
							"bSelectedOnly": true,
							"sFileName": 'report.csv'
						}, {
							"sExtends": "xls",
							"sButtonText": "Excel",
							"mColumns": [ 0, 1, 2 ],
							"bSelectedOnly": true,
							"sFileName": 'report.xls'
						}]
					}
				]
			}
		};
		// Create food item
		self.createItem = function() {
			var item = new FoodItem(self.item);

			item.$save(function() {
				// If successful refresh the table
				self.find();
				// Clear input fields
				delete self.item;
			}, function(errorResponse) {
				self.errorItem = errorResponse.data.message;
			});
		};

		// Update current food item
		self.updateItem = function(selectedItem) {
			var item = new FoodItem(selectedItem);

			item.$update(function() {
				// If successful refresh the table
				self.find();
			}, function(errorResponse) {
				self.errorItem = errorResponse.data.message;
			});
		};

		// Remove current food item
		self.removeItem = function(selectedItem) {
			var item = new FoodItem(selectedItem);

			item.$remove(function() {
				// If successful refresh the table
				self.find();
			}, function (errorResponse) {
				self.errorItem = errorResponse.data.message;
			});
		};

		// Create food category
		self.create = function() {
			var food = new Food(self.food);

			food.$save(function() {
				// If successful refresh the table
				self.find();
				// Clear input fields
				delete self.food;
			}, function(errorResponse) {
				self.error = errorResponse.data.message;
			});
		};

		// Find list of food categories and items
		self.find = function() {
			// Set loading state
			self.isLoading = true;

			Food.query({}, function (foods) {
				self.foods = foods;
				// Flatten obtained data for ng-repeat
				self.items = [];
				for (var food in foods) {
					food = foods[food];
					if (food.items) {
						for (var item in food.items) {
							item = food.items[item];
							item.categoryName = food.category;
							item.categoryId = food._id;
							item.categoryIdOld = food._id;
							self.items.push(item);
						}
					}
				}
				// Remove loading state after callback from the server
				self.isLoading = false;
			});
			// Remove error messages
			delete self.error;
			delete self.errorItem;
		};

		// Update current food category
		self.update = function(food) {
			food.$update(function() {
				// If successful refresh the table
				self.find();
			}, function(errorResponse) {
				self.error = errorResponse.data.message;
			});
		};

		// Remove current food category
		self.remove = function(food) {
			food.$remove(function() {
				// If successful refresh the table
				self.find();
			}, function (errorResponse) {
				self.error = errorResponse.data.message;
			});
		};
	}
})();
