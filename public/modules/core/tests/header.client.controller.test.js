'use strict';

(function() {
	describe('Controller: HeaderController', function() {
		//Initialize global variables
		var headerCtrl;

		// Load the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		beforeEach(inject(function($controller) {
			headerCtrl = $controller('HeaderController');
		}));

		it('should expose the authentication service', function() {
			expect(headerCtrl.authentication).toBeTruthy();
		});
	});
})();
