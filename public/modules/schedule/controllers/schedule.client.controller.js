(function() {
	'use strict';

	angular.module('schedule').controller('ScheduleController', ScheduleController);

	/* @ngInject */
	function ScheduleController(Food, FoodItem, moment) {
		var self = this;

		// Copy food item for smart table
		self.itemsCopy = [].concat(self.items);

		//=== Private variables ===//
		moment = moment.utc;

		// Find list of food items
		self.find = function() {
			// Set loading state
			self.isLoading = true;

			Food.query({}, function (foods) {
				// Flatten obtained data for ng-repeat
				self.items = [];
				for (var food in foods) {
					food = foods[food];
					if (food.items) {
						for (var item in food.items) {
							item = food.items[item];
							item.categoryName = food.category;
							item.categoryId = food._id;

							if (item.startDate)
								item.startDate = new Date(item.startDate);
							else
								item.startDate = new Date();
							self.items.push(item);
						}
					}
				}
				// Remove loading state after callback from the server
				self.isLoading = false;
			});
			// Remove error message
			delete self.error;
		};

		// Update current food item
		self.update = function(selectedItem) {
			var item = new FoodItem(selectedItem);

			item.$update(function() {
				// If successful refresh the table
				self.find();
			}, function(errorResponse) {
				self.error = errorResponse.data.message;
			});
		};
	}
})();
