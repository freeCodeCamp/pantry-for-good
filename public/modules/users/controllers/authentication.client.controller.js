(function() {
	'use strict';

	angular.module('users').controller('AuthenticationController', AuthenticationController);

	/* @ngInject */
	function AuthenticationController($http, Authentication, $state) {
		var self = this;

		self.authentication = Authentication;

		// If user is signed in then redirect back home
		if (self.authentication.user) $state.go('root');

		self.signup = function() {
			$http.post('/auth/signup', self.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				self.authentication.user = response;
				
				var accountType = response.accountType[0].charAt(0).toUpperCase() + response.accountType[0].slice(1);
				 
				// And redirect to create application state
				$state.go('root.create' + accountType + 'User', null, { reload: true });
			}).error(function(response) {
				self.error = response.message;
			});
		};

		self.signin = function() {
			$http.post('/auth/signin', self.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				self.authentication.user = response;
				
				var accountType = response.accountType[0].charAt(0).toUpperCase() + response.accountType[0].slice(1);
				
				// And redirect to create application or root state
				if (self.authentication.user.roles[0] === 'admin') {
					$state.go('root', null, { reload: true });
				} else {
					$state.go('root.create' + accountType + 'User', null, { reload: true });
				}
			}).error(function(response) {
				self.error = response.message;
			});
		};
	}
})();
