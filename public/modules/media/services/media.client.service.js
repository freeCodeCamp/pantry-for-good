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
			return $http.post('api/media/', mediaData);
		}

		function readMedia() {
			return $http.get('api/media/');
		}
	}
})();
