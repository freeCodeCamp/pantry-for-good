(function() {
	'use strict';

	angular.module('core').controller('HeaderController', HeaderController);

	/* @ngInject */
	function HeaderController(Authentication) {
		var self = this;

		self.authentication = Authentication;
	}
})();
