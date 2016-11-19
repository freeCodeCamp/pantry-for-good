(function() {
	'use strict';

	angular.module('core').controller('HomeController', HomeController);

	/* @ngInject */
	function HomeController(Authentication) {
		var self = this;

		// This provides Authentication context.
		self.authentication = Authentication;
	}
})();
