(function() {
	'use strict';

	angular.module('settings').controller('ChangeSettingsController', ChangeSettingsController);

	/* @ngInject */
	function ChangeSettingsController($scope, $rootScope, $stateParams, $state, Authentication, SettingsObject) {
		var self = this,
				user = Authentication.user;

		// This provides Authentication context
		self.authentication = Authentication;

		// If user is not signed in redirect to signin
		if(!user) $state.go('root.signin');

		SettingsObject.readSettings().
			then(function successCallback(response){
				$rootScope.tconfig = response.data;
			},
			function errorCallback(response){
				console.log('GET SETTINGS: error');
			}
		);

		// Could not get this to work using self.saveSettings
		$scope.saveSettings = function () {
			SettingsObject.saveSettings($rootScope.tconfig);
		};
	}
})();
