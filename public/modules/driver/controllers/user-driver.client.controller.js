import angular from 'angular';
import moment from 'moment';
import 'moment-recur';
import {stateGo} from 'redux-ui-router';

import {selectors} from '../../../store';
import {locateAddress, locateUser, stopLocateUser} from 'store/location';
import {deliver} from 'store/packing';
import {loadVolunteer, saveVolunteer} from 'store/volunteer';

const {utc} = moment;
const beginWeek = utc().startOf('isoWeek'); // Store the date of this week's Monday

const mapStateToThis = state => ({
	auth: state.auth,
	_customers: selectors.getAllCustomers(state),
	driverLocation: selectors.getUserCoordinates(state),
	addressLocation: selectors.getAddressCoordinates(state),
	loadingAddressLocation: selectors.loadingAddressLocation(state),
	loadAddressLocationError: selectors.loadAddressLocationError(state),
	loadingUserLocation: selectors.loadingUserLocation(state),
	loadUserLocationError: selectors.loadUserLocationError(state),
	loading: selectors.loadingVolunteers(state),
	loadVolunteersError: selectors.loadVolunteersError(state),
	driver: selectors.getOneVolunteer(state)(state.auth.user._id),
	settings: state.settings.data
});

const mapDispatchToThis = dispatch => ({
	loadDriver: id => dispatch(loadVolunteer(id)),
	saveDriver: driver => dispatch(saveVolunteer(driver)),
	locateAddress: address => dispatch(locateAddress(address)),
	locateUser: () => dispatch(locateUser()),
	stopLocateUser: () => dispatch(stopLocateUser()),
	_deliver: customerIds => dispatch(deliver(customerIds)),
	push: (route, params, options) => dispatch(stateGo(route, params, options))
});

angular.module('driver').controller('DriverUserController', DriverUserController);

/* @ngInject */
function DriverUserController($ngRedux) {
	this.$onInit = () => {
		this.unsubscribe = $ngRedux.connect(mapStateToThis, mapDispatchToThis)(this);
		this.user = this.auth.user;

		this.loadDriver(this.user._id);
		this.prevState = {};
	};

	this.$doCheck = () => {
		if (!this.loading && this.prevState.loading) {
			this.customers = this._customers.filter(customer =>
				this.driver.customers.find(c => c.id === customer.id));
		}

		this.prevState = {...this};
	}

	this.$onDestroy = () => {
		this.unsubscribe();
	};

	this.deliver = () => {
		const customerIds = this.customers.filter(c => c.isChecked)
			.map(c => c.id);
		this._deliver(customerIds);
	};

	this.updateNotes = () => this.saveDriver(this.driver);


	//=== Helper functions ===//
	// Enable button if any of the checkboxes are checked
	this.isDisabled = () =>
		!this.customers || !this.customers.filter(c => c.isChecked)

	// Select all checkboxes
	this.selectAll = () =>
		this.customers.forEach(c => c.isChecked = !this.allChecked);
}
