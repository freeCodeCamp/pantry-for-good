(function() {
	'use strict';

	// Service used for communicating with the settings REST endpoints
	angular.module('media').factory('MediaObject', MediaObject);

	/* @ngInject */
	function MediaObject($resource) {
		return $resource('api/media/', {
			cache: true
		});
	}
})();
