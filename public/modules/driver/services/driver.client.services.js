'use strict';

	// GeoLocation service used for communicating with the donation REST endpoints
	angular.module('driver').factory('GeoLocation', ['$resource','$http',
	function GeoLocation($resource, $http) {

		var service = {
			getCity:getCity,
			getGeoLocation:getGeoLocation
		};

		function getGeoLocation(address){
				return $http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + address);

		}

		function getCity(){
			return $resource('api/settings');
		}

		return service;
	}
]).factory('CustomerDriver', ['$resource',
   function($resource) {
		 return $resource('volunteer/driver/:volunteerId', {
			 volunteerId:'@volunteerId'
		 }, {
			 update: {
				 method: 'PUT'
			 }
		 });
	 }
 ]);
