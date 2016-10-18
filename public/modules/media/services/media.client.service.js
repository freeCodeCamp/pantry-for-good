(function() {
	'use strict';

	// Service used for communicating with the settings REST endpoints
	angular.module('media').factory('MediaObject', MediaObject);

	/* @ngInject */
	function MediaObject($http, $stateParams) {
		var service = {
			saveSettings: saveSettings,
			readSettings: readSettings
		};

		return service;

		function saveSettings(settings) {
			console.log("saved the media.");
			//return $http.post('api/settings/', settings);
		}

		function readSettings() {
			console.log("read the media.");
			//return $http.get('api/settings/');
		}
	}
})();
