(function() {
	'use strict';

	angular.module('settings').controller('ChangeSettingsController', ChangeSettingsController);

	/* @ngInject */
	function ChangeSettingsController($stateParams, $state, Authentication) {
		var self = this,
				user = Authentication.user;

		// This provides Authentication context
		self.authentication = Authentication;

		// If user is not signed in redirect to signin
		if(!user) $state.go('root.signin');

	}
})();
