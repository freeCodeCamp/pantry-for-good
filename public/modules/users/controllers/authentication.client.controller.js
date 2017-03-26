import angular from 'angular';
import capitalize from 'lodash/capitalize';
import {stateGo} from 'redux-ui-router';

import {
	signUp,
	signIn,
	clearUser,
	clearFlags
} from '../../../store/auth';

const mapStateToThis = state => ({
	auth: state.auth,
	success: state.auth.success,
	error: state.auth.error,
	settings: state.settings.data,
	media: state.media.data
});

const mapDispatchToThis = dispatch => ({
	register: credentials => dispatch(signUp(credentials)),
	login: credentials => dispatch(signIn(credentials)),
	logout: () => dispatch(clearUser()),
	clearFlags: () => dispatch(clearFlags()),
	push: (route, params, options) => dispatch(stateGo(route, params, options))
});

angular.module('users').controller('AuthenticationController', AuthenticationController);

/* @ngInject */
function AuthenticationController($http, Authentication, $state, $timeout, $ngRedux) {
	var self = this;
	this.$onInit = () => {
		this.unsubscribe = $ngRedux.connect(mapStateToThis, mapDispatchToThis)(this);
		this.store = $ngRedux
		this.clearFlags();

		// If user is signed in then redirect back home
		if (this.auth.user) this.push('root');
	};

	this.$onDestroy = () => this.unsubscribe();

	this.$doCheck = () => {
		// redirect on login
		const {user} = this.auth;
		if (!user) return;
		if (user.roles[0] === 'admin') {
			this.push('root', null, {reload: true});
		} else {
			const accountType = capitalize(user.accountType[0]);
			this.push(`root.create${accountType}User`, null, {reload: true});
		}
	};

	this.signup = () => this.register(this.credentials);

	this.signin = () => this.login(this.credentials);

	function inactivityTimer () {//function for determining the user's inactivity
		var flag;

		// DOM Events
		document.onmousemove = loggedIn;
		document.onkeypress = loggedIn;

		function logout() {
			//if flag is true, then the user is still active and the timeout function runs again
			if(flag) {
				flag = false;
				$timeout(logout, 900000);
			} else {
				self.logout();
				self.push('root.signin', null, { reload: true});
			}
		}

		function loggedIn(){
			flag = true;//mouse moves or keydown, the flag is true and the timeout function will fire again
		}

		function initialiseTimer() {
			$timeout(logout, 900000);//angular's own timeout function.
				flag = false;
		}
		initialiseTimer();//initialises timer
	}
}
