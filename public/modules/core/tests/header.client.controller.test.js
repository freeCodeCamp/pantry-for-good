import ApplicationConfiguration from '../../../config';

describe('Controller: HeaderController', function() {
	//Initialize global variables
	var headerCtrl;

	// Load the main application module
	beforeEach(angular.mock.module(ApplicationConfiguration.applicationModuleName));

	beforeEach(angular.mock.inject(function($controller) {
		headerCtrl = $controller('HeaderController');
	}));

	it('should expose the authentication service', function() {
		expect(headerCtrl.authentication).toBeTruthy();
	});
});
