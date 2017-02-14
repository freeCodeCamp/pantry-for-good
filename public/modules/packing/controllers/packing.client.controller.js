(function() {
	'use strict';

	angular.module('packing').controller('PackingController', PackingController);

	/* @ngInject */
	function PackingController($filter, FoodAdmin, FoodItem, CustomerAdmin, moment) {
		var self = this;

		// Copy data for smart table
		self.customersCopy = [].concat(self.customers);

		// Store the date of this week's Monday
		moment = moment.utc;
		var beginWeek = moment().startOf('isoWeek');

		//=== START chain of functions ===//
		// 1. Find a list of food items
		self.find = function() {
			// Set loading state
			self.isLoading = true;

			FoodAdmin.query({}, function (foods) {
				// Flatten obtained data for ng-repeat
				self.items = [];
				for (var food in foods) {
					food = foods[food];
					if (food.items) {
						for (var item in food.items) {
							item = food.items[item];
							// Attach category props to the item object
							item.categoryName = food.category;
							item.categoryId = food._id;
							// Count property to keep track of distribution quantity for this week
							item.toBeDistributed = 0;
							self.items.push(item);
						}
					}
				}
				// Trigger next function in the chain
				selectItems();
			});
			// Remove error messages
			delete self.error;
		};

		// 2. Select all items that are scheduled for distribution this week
		function selectItems() {
			self.allItems = self.items.filter(function(item) {
				// Check if the item has a schedule planned
				if (item.frequency) {
					// Construct a moment recurring object based on the starting date and frequency from schedule
					var interval = moment(item.startDate).recur().every(item.frequency).weeks();
					// Return true only if the current week matches one of the recurring dates
					return interval.matches(beginWeek);
				}
			});
			// Trigger next function in the chain
			findCustomers();
		}

		// 3. Find a list of customers and filter based on status and last packed date
		function findCustomers() {
			CustomerAdmin.query({}, function(customers) {
				self.customers = customers.filter(function(customer) {
					// If the packed date equals this week's date then the customer package
					// has already been packed for this week
					return !moment(customer.lastPacked).isSame(beginWeek) && (customer.status === 'Accepted') ;
				});
				// Trigger next function in the chain
				getFoodItems();
			});
		}

		// 4. Figure out which food items should be in the packing list
		function getFoodItems() {
			self.customers.forEach(function(customer) {
				customer.packingList = self.allItems.filter(function(item) {
					// Condition checks if the item is part of the customer's food preference
					if (customer.foodPreferences.indexOf(item._id) > -1) {
						item.toBeDistributed++;
						return item;
					}
				});
			});
			// Trigger next function in the chain
			verifyInventory();
		}

		// 5. Verify if there is enough inventory stock to support the packing lists
		function verifyInventory() {
			// Flag variable to keep track of change in the items array
			var changed = false;
			self.allItems = self.allItems.filter(function(item) {
				// Check if the amount to be distributed exceeds current inventory
				if (item.toBeDistributed > item.quantity) {
					changed = true;
					return null;
				}
				return item;
			});
			if (changed) {
				// Go back to #4 and generate a new packing list
				getFoodItems();
			} else {
				// Remove loading state
				self.isLoading = false;
			}
		}
		//=== END chain of functions ===//

		// Update customers and subtract inventory stock
		self.update = function() {
			// Set loading state
			self.isLoading = true;
			// Keep track of server calls that haven't returned yet
			var updatesInProgress = 0;

			self.customers.forEach(function(customer) {
				if (customer.isChecked) {
					customer.packingList.forEach(function(itemCustomer) {
						self.allItems.some(function(item) {
							if (item._id === itemCustomer._id) {
								// For each item in the customer's packing list, subtract quantity by 1
								item.quantity--;
								// Keep track of which items have changed and need to be updated to the server
								item.isPacked = true;
								return true;
							}
							return false;
						});
					});
					// Update the packed date to this week
					customer.lastPacked = beginWeek;
					// Add server call
					updatesInProgress++;
					customer.$update(function() {
						// Subtract server call upon return
						updatesInProgress--;
						// If all item and customer updates have returned from the server then we can
						// render the table again by initiating a find using the updated data
						// Note: This will trigger only once, depending on which callback comes in last,
						// which is why it's in both the customer and item callbacks
						if (!updatesInProgress) self.find();
					}, function(errorResponse) {
						self.error = errorResponse.data.message;
					});
				}
			});

			self.allItems.forEach(function(item) {
				if (item.isPacked) {
					item = new FoodItem(item);

					// Add server call
					updatesInProgress++;
					item.$update(function() {
						// Subtract server call upon return
						updatesInProgress--;
						// If all item and customer updates have returned from the server then we can
						// render the table again by initiating a find using the updated data
						// Note: This will trigger only once, depending on which callback comes in last,
						// which is why it's in both the customer and item callbacks
						if (!updatesInProgress) self.find();
					}, function(errorResponse) {
						self.error = errorResponse.data.message;
					});
				}
			});
		};

		//=== Helper functions
		// Determine column span of empty cells
		self.getColSpan = function(customer) {
			if (self.allItems && customer.packingList) {
				return self.allItems.length - customer.packingList.length;
			}
			return 1;
		};

		// Select all checkboxes
		self.selectAll = function() {
			self.customers.forEach(function(customer) {
				customer.isChecked = !self.allSelected;
			});
		};

		// Enable submit button if any of the checkboxes are checked
		self.isDisabled = function() {
			return self.customers ? !$filter('filter')(self.customers, {isChecked: true}).length : true;
		};
	}
})();
