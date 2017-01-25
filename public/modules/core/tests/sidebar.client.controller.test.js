import ApplicationConfiguration from '../../../config';

(function() {
	describe('Controller: SidebarController', function() {
		//Initialize global variables
		var scope,
				sidebarCtrl,
				Menus;

		// Load the main application module
		beforeEach(angular.mock.module(ApplicationConfiguration.applicationModuleName));

		beforeEach(angular.mock.inject(function($controller, $rootScope, _Menus_) {
			scope = $rootScope.$new();

			Menus = _Menus_;

			sidebarCtrl = $controller('SidebarController', {
				$scope: scope
			});
		}));

		it('should expose the authentication service', function() {
			expect(sidebarCtrl.authentication).toBeTruthy();
		});

		it('should not have any menus on load', function() {
			expect(sidebarCtrl.menu).toBeFalsy();
		});

		it('should only have apply menu after user login/signup', function() {
			var user = { roles: ['user'], hasApplied: false, accountType: ['customer'] };
			sidebarCtrl.getMenu(user);
			expect(sidebarCtrl.menu).toBeTruthy();
			expect(sidebarCtrl.menu.items.length).toBe(1);
			expect(sidebarCtrl.menu.items[0].title).toEqual('Apply');
		});

		it('should only have edit menu after user applies', function() {
			var user = { roles: ['user'], hasApplied: true, accountType: ['customer'] };
			sidebarCtrl.getMenu(user);
			expect(sidebarCtrl.menu).toBeTruthy();
			expect(sidebarCtrl.menu.items.length).toBe(1);
			expect(sidebarCtrl.menu.items[0].title).toEqual('Edit Application');
		});

		it('should only have edit menu for customers', function() {
			var user = { roles: ['customer'], hasApplied: true, accountType: ['customer'] };
			sidebarCtrl.getMenu(user);
			expect(sidebarCtrl.menu).toBeTruthy();
			expect(sidebarCtrl.menu.items.length).toBe(1);
			expect(sidebarCtrl.menu.items[0].title).toEqual('Edit Application');
		});

		it('should only have edit menu for volunteers', function() {
			var user = { roles: ['volunteer'], hasApplied: true, accountType: ['volunteer'] };
			sidebarCtrl.getMenu(user);
			expect(sidebarCtrl.menu).toBeTruthy();
			expect(sidebarCtrl.menu.items.length).toBe(1);
			expect(sidebarCtrl.menu.items[0].title).toEqual('Edit Application');
		});

		it('should only have edit menu for donors', function() {
			var user = { roles: ['donor'], hasApplied: true, accountType: ['donor'] };
			sidebarCtrl.getMenu(user);
			expect(sidebarCtrl.menu).toBeTruthy();
			expect(sidebarCtrl.menu.items.length).toBe(1);
			expect(sidebarCtrl.menu.items[0].title).toEqual('Edit Application');
		});

		it('should have all menus available for admins', function() {
			var user = { roles: ['admin'] };
			var n = Menus.getMenu('admin').items.length;
			sidebarCtrl.getMenu(user);
			expect(sidebarCtrl.menu).toBeTruthy();
			expect(sidebarCtrl.menu.items.length).toBe(n);
		});
	});
})();
