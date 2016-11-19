(function() {
	'use strict';

	angular.module('core').controller('SidebarController', SidebarController);

	/* @ngInject */
	function SidebarController($scope, Authentication, Menus) {
		var self = this;

		self.authentication = Authentication;
		self.user = Authentication.user;
		self.isCollapsed = false;
		self.getMenu = getMenu;
		self.toggleCollapsibleMenu = toggleCollapsibleMenu;
		// Get menus based on user's role
		if (self.user) getMenu(self.user);

		function getMenu(user) {
			var role = user.roles[0];
			// Copy the Menus object to avoid the need for a page refresh after redirects
			var menus = angular.copy(Menus);

			self.menu = menus.getMenu(role);
			// Adjust menu ui-routes based on the user's account type   
			if (role === 'user'){
				var accountType = user.accountType[0].charAt(0).toUpperCase() + user.accountType[0].slice(1);
				
				self.menu.items.forEach(function(item) {
					item.uiRoute = item.uiRoute.replace(/REPLACETYPE/, accountType).replace(/REPLACEID/, user.accountType[0]);
				});
				// Show the right menu before and after a user applies
				if (user.hasApplied) {
					menus.removeMenuItem(role, '/create');
				} else { 
					menus.removeMenuItem(role, '/edit');
				}
			}
		}

		function toggleCollapsibleMenu() {
			self.isCollapsed = !self.isCollapsed;
		}

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			self.isCollapsed = false;
		});
	}
})();
