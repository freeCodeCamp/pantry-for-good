import angular from 'angular';
import moment from 'moment';
import 'moment-recur';

import {selectors} from '../../../store';
import {loadCustomers, saveCustomer} from '../../../store/customer';
import {loadFoods} from '../../../store/food-category';
import {saveFoodItem} from '../../../store/food-item';
import {pack} from '../../../store/packing';

const mapStateToThis = state => ({
	_customers: selectors.getAllCustomers(state),
	_items: selectors.getAllFoodItems(state),
  loading: selectors.loadingCustomers(state) ||
						selectors.loadingFoods(state),
  loadCustomersError: selectors.loadCustomersError(state),
	loadFoodsError: selectors.loadFoodsError(state)
});

const mapDispatchToThis = dispatch => ({
	loadCustomers: () => dispatch(loadCustomers()),
	loadFoods: () => dispatch(loadFoods()),
	_pack: (customerIds, items, beginWeek) => dispatch(pack(customerIds, items, beginWeek))
});

angular.module('packing').controller('PackingController', PackingController);

/* @ngInject */
function PackingController($ngRedux) {
	const {utc} = moment;
	const beginWeek = utc().startOf('isoWeek');

	this.$onInit = () => {
		this.unsubscribe = $ngRedux.connect(mapStateToThis, mapDispatchToThis)(this);
		this.loaded = false;
		this.initialized = false;
		this.prevState = {};
		this.allSelected = false;

		this.loadCustomers();
		this.loadFoods();
	};

	this.$doCheck = () => {
		if (!this.loading && this.prevState.loading) {
			if (this.loadFoodsError) this.error = this.loadFoodsError;
			else if (this.loadCustomersError) this.error = this.loadCustomersError;
			else this.loaded = true;
		}

		if (this.loaded && !this.initialized) {
			const scheduledCustomers = getScheduledCustomers(this._customers);
			const scheduledItems = getScheduledItems(this._items);
			const {customers, items} = getPackedCustomersAndItems(scheduledCustomers,
					scheduledItems);

			this.customers = customers;
			this.items = scheduledItems;

			this.initialized = true;
		}

		if (this.customers) {
			this.customerIds = this.customers.filter(customer => customer.isChecked)
				.map(customer => customer.id);
		}

		this.prevState = {...this};
	};

	this.pack = () => this._pack(this.customerIds, this.items, beginWeek);

	this.$onDestroy = () => this.unsubscribe();

	// 2. Select all items that are scheduled for distribution this week
	function getScheduledItems(items) {
		return items.filter(item => {
			// Check if the item has a schedule planned
			if (item.frequency) {
				// Construct a moment recurring object based on the starting date and frequency from schedule
				const interval = utc(item.startDate).recur()
					.every(item.frequency).days();
				// Return true only if the current week matches one of the recurring dates
				return interval.matches(beginWeek);
			}
		});
	}

	// 3. Find a list of customers and filter based on status and last packed date
	function getScheduledCustomers(customers) {
		// If the packed date equals this week's date then the customer package
		// has already been packed for this week
		return customers.filter(customer =>
			!utc(customer.lastPacked).isSame(beginWeek) &&
				(customer.status === 'Accepted')
		);
	}

	// 4. Figure out which food items should be in the packing list
	function getPackedCustomersAndItems(scheduledCustomers, scheduledItems) {
		let itemCounts = scheduledItems.map(item => item.quantity);

		const customers = scheduledCustomers.map(customer => ({
			...customer,
			packingList: scheduledItems.map((item, i) => {
				// If the item is in the customer's food preferences and in stock
				// add it to customers packing list and decrement its count
				if (customer.foodPreferences.find(fp => fp && fp._id === item._id) &&
						itemCounts[i] > 0) {
					itemCounts[i]--;
					return item;
				}
			}).filter(item => item)
		}));

		const items = scheduledItems.map((item, i) => ({
			...item,
			quantity: itemCounts[i]
		}));

		return {customers, items};
	}

	//=== Helper functions
	// Determine column span of empty cells
	this.getColSpan = customer => {
		if (this.scheduledItems && customer.packingList) {
			return this.scheduledItems.length - customer.packingList.length;
		}
		return 1;
	};

	// Select all checkboxes
	this.selectAll = () => {
		// this.allSelected = !this.allSelected;
		this.customers.forEach(customer => {
			customer.isChecked = this.allSelected;
		});
	};

	// Enable submit button if any of the checkboxes are checked
	this.isDisabled = () => {
		// return this.customers ? !$filter('filter')(this.customers, {isChecked: true}).length : true;
		return !this.customers || !this.customers.find(customer => customer.isChecked)
	};
}
