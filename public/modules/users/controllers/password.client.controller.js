import angular from 'angular';
import {stateGo} from 'redux-ui-router';

import {setUser} from '../../../store/auth';

const mapStateToThis = state => ({
	auth: state.user
});

const mapDispatchToThis = dispatch => ({
	setUser: user => dispatch(setUser(user)),
	push: (route, params, options) => dispatch(stateGo(route, params, options))
});

angular.module('users').controller('PasswordController', PasswordController);

/* @ngInject */
function PasswordController($stateParams, $http, $state, $ngRedux) {
	this.$onInit = () => {
		this.unsubscribe = $ngRedux.connect(mapStateToThis, mapDispatchToThis)(this);

		// If user is not signed in then redirect back home
		if (this.authentication.user) this.push('root');
		this.user = this.auth.user;
	};

	this.$onDestroy = () => this.unsubscribe();

	// Submit forgotten password account id
	this.askForPasswordReset = () => {
		this.success = this.error = null;

		$http.post('/api/auth/forgot', this.credentials).then(response => {
			response = response.data;

			// Show user success message and clear form
			this.credentials = null;
			this.success = response.message;
		}).catch(response => {
			// Show user error message and clear form
			this.credentials = null;
			this.error = response.message;
		});
	};

	// Change user password
	this.resetUserPassword = () => {
		this.success = this.error = null;

		$http.post('/api/auth/reset/' + $stateParams.token, this.passwordDetails).then(response => {
			response = response.data;

			// If successful show success message and clear form
			this.passwordDetails = null;

			// Attach user profile
			this.setUser(response);

			// And redirect to the index page
			$state.go('root.reset-success', null, { reload: true });
		}).catch(response => {
			this.error = response.message;
		});
	};
}
