(function() {
	'use strict';

	// Donation service used for communicating with the donation REST endpoints
	angular.module('driver').factory('GoogleObject', GoogleObject);

	/* @ngInject */
	function GoogleObject() {
		return google;
	}
})();


/*
function getGoogleObject() {
	var data= {};
	var promise = $http.get("https://maps.googleapis.com/maps/api/js").then(function(response){
		data =  response.data
	})
	return data;
}
*/
