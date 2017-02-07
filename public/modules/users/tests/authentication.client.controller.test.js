import ApplicationConfiguration from '../../../config';

(function() {
	// Authentication controller Spec
	describe('Controller: AuthenticationController', function() {
		// Initialize global variables
		var authenticationCtrl,
				httpBackend,
				location;

		var user = {
			accountType: ['customer']
		}

		// Load the main application module
		beforeEach(angular.mock.module(ApplicationConfiguration.applicationModuleName));

		beforeEach(angular.mock.inject(function($controller, $location, $httpBackend) {
			httpBackend = $httpBackend;
			location = $location;

			// A hack to resolve errors during state transitions
			// httpBackend.whenGET(/views.*/).respond(200, '');

			httpBackend.whenGET('api/settings').respond('');
			httpBackend.whenGET('api/media').respond('');

			// Initialize the Authentication controller
			authenticationCtrl = $controller('AuthenticationController');
		}));


		it('self.signin() should login with a correct user and password', function() {
			authenticationCtrl.authentication.credentials = user;

			// Test expected GET request
			httpBackend.expectPOST('/auth/signin').respond(200, user);

			authenticationCtrl.signin();
			httpBackend.flush();

			expect(authenticationCtrl.authentication.user).toEqual(user);
			expect(location.url()).toEqual('/');
		});

		it('self.signin() should fail to log in with nothing', function() {
			// Test expected POST request
			httpBackend.expectPOST('/auth/signin').respond(400, {
				'message': 'Missing credentials'
			});

			authenticationCtrl.signin();
			httpBackend.flush();

			expect(authenticationCtrl.error).toEqual('Missing credentials');
		});

		it('self.signin() should fail to log in with wrong credentials', function() {
			// Foo/Bar combo assumed to not exist
			authenticationCtrl.authentication.user = 'Foo';
			authenticationCtrl.credentials = 'Bar';

			// Test expected POST request
			httpBackend.expectPOST('/auth/signin').respond(400, {
				'message': 'Unknown user'
			});

			authenticationCtrl.signin();
			httpBackend.flush();

			// Test scope value
			expect(authenticationCtrl.error).toEqual('Unknown user');
		});

		it('self.signup() should register with correct data', function() {
			// Test expected GET request
			authenticationCtrl.authentication.user = 'Fred';
			httpBackend.expectPOST('/auth/signup').respond(200, 'Fred');

			authenticationCtrl.signup();
			httpBackend.flush();

			expect(authenticationCtrl.authentication.user).toBe('Fred');
			expect(authenticationCtrl.error).toEqual(undefined);
			expect(location.url()).toBe('/');
		});

		it('self.signup() should fail to register with duplicate Username', function() {
			// Test expected POST request
			httpBackend.expectPOST('/auth/signup').respond(400, {
				'message': 'Username already exists'
			});

			authenticationCtrl.signup();
			httpBackend.flush();

			// Test scope value
			expect(authenticationCtrl.error).toBe('Username already exists');
		});
	});
}());
