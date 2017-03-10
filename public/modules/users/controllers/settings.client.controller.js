import angular from 'angular';
import {stateGo} from 'redux-ui-router';

import {
	setUser,
	setProfile,
	setPassword,
	clearFlags
} from '../../../store/auth';

const mapStateToThis = state => ({
	auth: state.auth,
	success: state.auth.success,
	error: state.auth.error
});

const mapDispatchToThis = dispatch => ({
	setUser: user => dispatch(setUser(user)),
	setProfile: user => dispatch(setProfile(user)),
	setPassword: password => dispatch(setPassword(password)),
	clearFlags: () => dispatch(clearFlags()),
	push: (route, params, options) => dispatch(stateGo(route, params, options))
});

angular.module('users').controller('SettingsController', SettingsController);

/* @ngInject */
function SettingsController($ngRedux) {
	this.$onInit = () => {
		this.unsubscribe = $ngRedux.connect(mapStateToThis, mapDispatchToThis)(this);
		this.clearFlags();

		// If user is not signed in then redirect back home
		if (!this.auth.user) this.push('root');

		// set the forms user model to current user
		this.user = this.auth.user;
	};

	this.$onDestroy = () => this.unsubscribe();

	// Update a user profile
	this.updateUserProfile = isValid => isValid && this.setProfile(this.user);

	// Change user password
	this.changeUserPassword = () => this.setPassword(this.passwordDetails);
}
