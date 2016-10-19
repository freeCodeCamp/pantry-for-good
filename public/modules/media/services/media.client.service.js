(function() {
	'use strict';

	// Service used for communicating with the settings REST endpoints
	angular.module('media').factory('MediaObject', MediaObject);

	/* @ngInject */
	function MediaObject($http, $stateParams) {
		var service = {
			saveMedia: saveMedia,
			readMedia: readMedia
		};

		return service;

		function saveMedia(mediaData) {
			console.log("saved the media.");
			return $http.post('api/media/', mediaData);
		}

		function readMedia() {
			console.log("read the media.");
			return $http.get('api/media/');
		}
	}
})();
