'use strict';

(function() {
	describe('Controller: HomeController', function() {
		//Initialize global variables
		var homeCtrl;

		// Load the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		beforeEach(inject(function($controller) {
			homeCtrl = $controller('HomeController');
		}));

		it('should expose the authentication service', function() {
			expect(homeCtrl.authentication).toBeTruthy();
		});
	});
})();
