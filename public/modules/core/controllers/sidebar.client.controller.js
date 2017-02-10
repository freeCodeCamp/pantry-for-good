import angular from 'angular';
import capitalize from 'lodash/capitalize';

const mapStateToThis = state => ({
	auth: state.auth
});

angular.module('core').controller('SidebarController', SidebarController);

/* @ngInject */
function SidebarController($scope, $ngRedux, Menus) {
	this.$onInit = () => {
		this.unsubscribe = $ngRedux.connect(mapStateToThis)(this);

		this.user = this.auth.user;
		this.isCollapsed = false;

		// Get menus based on user's role
		if (this.user) this.getMenu(this.user);
	};

	this.$onDestroy = () => this.unsubscribe();

	this.getMenu = user => {
		const role = user.roles[0];
		// Copy the Menus object to avoid the need for a page refresh after redirects
		const menus = angular.copy(Menus);

		this.menu = menus.getMenu(role);
		// Adjust menu ui-routes based on the user's account type
		if (role === 'user'){
			const accountType = capitalize(user.accountType[0]);

			this.menu.items.forEach(function(item) {
				item.uiRoute = item.uiRoute.replace(/REPLACETYPE/, accountType).replace(/REPLACEID/, user.accountType[0]);
			});
			// Show the right menu before and after a user applies
			if (user.hasApplied) {
				menus.removeMenuItem(role, '/create');
			} else {
				menus.removeMenuItem(role, '/edit');
			}
		}
	};

	this.toggleCollapsibleMenu = () => this.isCollapsed = !this.isCollapsed;

	// tests run before setUser action fires, how to do this better?
	this.auth = this.auth || {};

	// Collapsing the menu after navigation
	$scope.$on('$stateChangeSuccess', () => {
		this.isCollapsed = false;
	});
}
