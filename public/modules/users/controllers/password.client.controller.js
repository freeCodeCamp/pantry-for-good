import angular from 'angular';
import {stateGo} from 'redux-ui-router';

import {
	setUser,
	clearFlags,
	forgotPassword,
	resetPassword
} from '../../../store/auth';

const mapStateToThis = state => ({
	auth: state.auth,
	error: state.auth.error,
	success: state.auth.success,
	fetching: state.auth.fetching
});

const mapDispatchToThis = dispatch => ({
	setUser: user => dispatch(setUser(user)),
	clearFlags: () => dispatch(clearFlags()),
	forgotPassword: credentials => dispatch(forgotPassword(credentials)),
	_resetPassword: (token, password) => dispatch(resetPassword(token, password)),
	push: (route, params, options) => dispatch(stateGo(route, params, options))
});

angular.module('users').controller('PasswordController', PasswordController);

/* @ngInject */
function PasswordController($stateParams, $http, $state, $ngRedux) {
	this.$onInit = () => {
		this.unsubscribe = $ngRedux.connect(mapStateToThis, mapDispatchToThis)(this);
		this.clearFlags();

		// If user is signed in then redirect back home
		if (this.auth.user) this.push('root');
		this.credentials = {};
	};

	this.$onDestroy = () => this.unsubscribe();

	this.$doCheck = () => {
		if (this.resetting && this.success)
			this.push('root.reset-success', null, { reload: true });
		else this.resetting = false;
	};

	this.resetPassword = () => {
		this.resetting = true;
		this._resetPassword($stateParams.token, this.credentials);
	};
}
