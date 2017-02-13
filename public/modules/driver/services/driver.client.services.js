(function() {
	'use strict';

	// GeoLocation service used for communicating with the donation REST endpoints
	angular.module('driver').factory('GeoLocation', GeoLocation);

	/* @ngInject */
	function GeoLocation($resource, $http) {

		var service = {
			getCity:getCity,
			getGeoLocation:getGeoLocation
		};

		function getGeoLocation(city){
				return $http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + city);

		}

		function getCity(){
			return $resource('api/settings');
		}

		return service;
	}
})();
