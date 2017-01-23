import angular from 'angular';

	// GeoLocation service used for communicating with the donation REST endpoints
export default angular.module('core').factory('GeoLocation', GeoLocation).name;

/* @ngInject */
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
