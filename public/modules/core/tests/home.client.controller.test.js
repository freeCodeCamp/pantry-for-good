import ApplicationConfiguration from '../../../config';

(function() {
	describe('Controller: HomeController', function() {
		//Initialize global variables
		var homeCtrl;

		// Load the main application module
		beforeEach(angular.mock.module(ApplicationConfiguration.applicationModuleName));

		beforeEach(angular.mock.inject(function($controller) {
			homeCtrl = $controller('HomeController');
		}));

		it('should expose the authentication service', function() {
			expect(homeCtrl.authentication).toBeTruthy();
		});
	});
})();
