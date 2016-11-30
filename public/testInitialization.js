'use strict';

(function() {
	describe('Initialization Tests', function() {
		var httpBackend;

		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		beforeEach(inject(function($httpBackend) {
			httpBackend = $httpBackend;
			httpBackend.whenGET(/views.*/).respond(200, '');
		}));
		
		afterEach(function() {
    	httpBackend.verifyNoOutstandingExpectation();
    	httpBackend.verifyNoOutstandingRequest();
  	});

		it('The app starts by calling api/settings and api/media', function() {
			httpBackend.expectGET('api/settings/').respond([]);
			httpBackend.expectGET('api/media/').respond([]);
			httpBackend.flush();
		});
	});
})();
