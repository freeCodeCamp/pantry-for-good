(function() {
	'use strict';

	// Grab global google map API and clusterer variables
	angular.module('driver').factory('GoogleMapAPI', GoogleMapAPI);

	/* @ngInject */
	function GoogleMapAPI() {
		var data = {};
		data.googleObject = google;
		data.markerClusterer = MarkerClusterer;
		return data;
	}
})();
