(function() {
	'use strict';

	// Settings service used for communicating with the settings REST endpoints
	angular.module('settings').factory('SettingsObject', SettingsObject);

	/* @ngInject */
	function SettingsObject($http, $stateParams) {
		var service = {
			saveSettings: saveSettings,
			readSettings: readSettings
		};

		return service;

		function saveSettings(settings) {
			return $http.post('api/settings/', settings);
		}

		function readSettings() {
			var settings = $http.get('api/settings/');
			return settings;
		}
	}
})();
