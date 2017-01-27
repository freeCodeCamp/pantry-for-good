(function() {
	'use strict';

	// Markers service used to store markers
	angular.module('driver').factory('Markers', Markers);

	/* @ngInject */
	function Markers() {
	   return {
       markers:[]
     }
   }
})();
