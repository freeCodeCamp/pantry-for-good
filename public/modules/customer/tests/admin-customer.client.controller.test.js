'use strict';

(function() {
	describe('Controller: CustomerAdminController', function() {
		//Initialize global variables
		var customerCtrl,
				httpBackend;
	
		// Load the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));
		
		beforeEach(inject(function($rootScope, $state, $controller, $httpBackend) {
			httpBackend = $httpBackend;
			// A hack to resolve errors during state transitions
			httpBackend.whenGET(/views.*/).respond(200, '');
			var state = {current: {name: 'root.editCustomerAdmin'}};
			customerCtrl = $controller('CustomerAdminController', {$state: state});

			httpBackend.expectGET('api/settings/').respond('');
			httpBackend.expectGET('api/media/').respond('');
			httpBackend.expectGET('api/sections').respond('');
			httpBackend.expectGET('api/fields').respond('');
		}));
		
		afterEach(function() {
    	httpBackend.verifyNoOutstandingExpectation();
    	httpBackend.verifyNoOutstandingRequest();
  	});
		
		it('self.findFood should return an array with at least one food object fetched from XHR', inject(function(Food) {
			var sampleFood = new Food({ 
				items: [{ 
					name: 'Pasta', 
					quantity: 1, 
					frequency: 1 
				}]
			});
			
			httpBackend.expectGET('admin/foods').respond([sampleFood]);
			
			customerCtrl.findFood();
			httpBackend.flush();
			
			expect(customerCtrl.foodList).toEqual(sampleFood.items);
		}));
		
		it('self.selectAll() should select all food items', function() {
			var food1 = { 
				items: [{ 
					_id: 1, 
					name: 'Chicken', 
					quantity: 1, 
					frequency: 1 
				}]
			};
			var food2 = { 
				items: [{ 
					_id: 2, 
					name: 'Waffles', 
					quantity: 1, 
					frequency: 1 
				}]
			};
			
			httpBackend.expectGET('admin/foods').respond([food1, food2]);
			
			customerCtrl.findFood();
			httpBackend.flush();
			
			customerCtrl.selectAll(false);
			expect(customerCtrl.foodList).toEqual([food1.items[0], food2.items[0]]);
			expect(customerCtrl.customer.foodPreferences).toEqual([1, 2]);
			
			customerCtrl.selectAll(true);
			expect(customerCtrl.customer.foodPreferences).toEqual([]);
		});
		
		it('self.foodIsChecked() should check if item exists in food preferences', function() {
			var food1 = { 
				items: [{ 
					_id: 1, 
					name: 'Chicken', 
					quantity: 1, 
					frequency: 1 
				}]
			};
			var food2 = { 
				items: [{ 
					_id: 2, 
					name: 'Waffles', 
					quantity: 1, 
					frequency: 1 
				}]
			};
			
			httpBackend.expectGET('admin/foods').respond([food1, food2]);
			
			customerCtrl.findFood();
			httpBackend.flush();
			
			customerCtrl.customer.foodPreferences.push(food1.items[0]._id);
			expect(customerCtrl.foodIsChecked(food1.items[0])).toBeTruthy();
			expect(customerCtrl.foodIsChecked(food2.items[0])).toBeFalsy();
		});
		
		it('self.toggleSelection() should add/remove items from food preferences', function() {
			var food1 = { 
				items: [{ 
					_id: 1, 
					name: 'Chicken', 
					quantity: 1, 
					frequency: 1 
				}]
			};
			var food2 = { 
				items: [{ 
					_id: 2, 
					name: 'Waffles', 
					quantity: 1, 
					frequency: 1 
				}]
			};
			
			httpBackend.expectGET('admin/foods').respond([food1, food2]);
			
			customerCtrl.findFood();
			httpBackend.flush();
			
			customerCtrl.toggleSelection(food1.items[0]);
			expect(customerCtrl.customer.foodPreferences).toContain(1);
			
			customerCtrl.toggleSelection(food1.items[0]);
			expect(customerCtrl.customer.foodPreferences).toEqual([]);
		});
		
		it('self.setDependantList() should add/remove dependants from household', function() {
			var dependant = { 
				name: 'John Doe', 
				relationship: 'Son', 
				dateOfBirth: '01/01/2000' 
			};
			
			customerCtrl.setDependantList(1);
			expect(customerCtrl.customer.household.length).toBe(1);
			
			customerCtrl.setDependantList(5);
			expect(customerCtrl.customer.household.length).toBe(5);
			
			customerCtrl.setDependantList(2);
			customerCtrl.customer.household.push(dependant);
			expect(customerCtrl.customer.household).toContain(dependant);
			
			httpBackend.flush();
		});
	});
})();
