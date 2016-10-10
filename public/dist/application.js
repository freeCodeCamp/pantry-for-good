'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'chasdei-kaduri';
	var applicationModuleVendorDependencies = ['ngResource', 'ngCookies',  'ngAnimate',  'ngTouch',
		'ngSanitize',  'ui.router', 'ui.bootstrap', 'ui.utils', 'datatables', 'datatables.colvis',
		'datatables.colreorder', 'AngularPrint', 'smart-table', 'angularMoment', 'uiGmapgoogle-maps'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();

'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('core');

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('customer');

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('donor');

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('driver');

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('food');

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('packing');

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('schedule');
'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('users');

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('volunteer');

'use strict';

// Setting up routes
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Root state routing
		$stateProvider.
		state('root', {
			url: '/',
			views: {
				'header': {
					templateUrl: 'modules/core/views/header.client.view.html',
					controller: 'HeaderController as headerCtrl'
				},
				'sidebar': {
					templateUrl: 'modules/core/views/sidebar.client.view.html',
					controller: 'SidebarController as sidebarCtrl'
				},
				'content': {
					templateUrl: 'modules/core/views/home.client.view.html',
					controller: 'HomeController as homeCtrl'
				},
				'footer': {
					templateUrl: 'modules/core/views/footer.client.view.html'
				}
			}
		}).

		// 403 Unauthorized
		state('root.403', {
			url: '403',
			views: {
				'content@': {
					templateUrl: 'modules/core/views/errors/403.client.view.html'
				}
			}
		}).
		// 404 Page not found
		state('root.404', {
			url: '404',
			views: {
				'content@': {
					templateUrl: 'modules/core/views/errors/404.client.view.html'
				}
			}
		}).
		// 500 Server error
		state('root.500', {
			url: '500',
			views: {
				'content@': {
					templateUrl: 'modules/core/views/errors/500.client.view.html'
				}
			}
		});

		// Redirect route from / to /signin
		$urlRouterProvider.when('', 'signin');

		// Redirect to 404 page view when route not found
		$urlRouterProvider.otherwise('404');
	}
]);

(function() {
	'use strict';

	HeaderController.$inject = ["Authentication"];
	angular.module('core').controller('HeaderController', HeaderController);

	/* @ngInject */
	function HeaderController(Authentication) {
		var self = this;

		self.authentication = Authentication;
	}
})();

(function() {
	'use strict';

	HomeController.$inject = ["Authentication"];
	angular.module('core').controller('HomeController', HomeController);

	/* @ngInject */
	function HomeController(Authentication) {
		var self = this;

		// This provides Authentication context.
		self.authentication = Authentication;
	}
})();

(function() {
	'use strict';

	SidebarController.$inject = ["$scope", "Authentication", "Menus"];
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

(function() {
	'use strict';
	
	dateField.$inject = ["$filter", "moment"];
	angular.module('core').directive('dateField', dateField);

	/* @ngInject */
	function dateField($filter, moment) {
		return {
      require: 'ngModel',
			link: function (scope, element, attrs, ngModelController) {
				ngModelController.$parsers.push(function(data) {
					//View -> Model
					var date = moment(data, 'YYYY-MM-DD', true);
					
					function isValid() {
						return date.diff(moment()) < 0;
					}

					ngModelController.$setValidity('date', isValid());
					
					return isValid() ? date.toDate() : undefined;
				});
				ngModelController.$formatters.push(function (data) {
					//Model -> View
					return $filter('date')(data, "yyyy-MM-dd");
				});
			}
    };
	}
})();

(function() {
	'use strict';

	angular.module('core').directive('onLastRepeat', onLastRepeat);

	/* @ngInject */
	function onLastRepeat () {
		return function(scope) {
			if (scope.$last) {
				scope.$emit('repeatLastDone');
			}
		};
	}
})();

'use strict';

// Add push menu functionality to the sidebar
angular.module('core').directive('sidebarToggle', function() {
	return {
		restrict: 'C',
		compile: function (element, attr) {
			if (attr.toggle === 'offcanvas') {
				element.click(function (e) {
					e.preventDefault();

					// If window is large enough, enable sidebar push menu
					if (angular.element(window).width() >= 768) {
						angular.element('body').toggleClass('sidebar-collapse');
					}
					// Handle sidebar push menu for small screens
					else {
						if (angular.element('body').hasClass('sidebar-open')) {
							angular.element('body').removeClass('sidebar-open');
							angular.element('body').removeClass('sidebar-collapse');
						} else {
							angular.element('body').addClass('sidebar-open');
						}
					}
				});
			}
		}
	};
});

(function() {
	'use strict';

	angular.module('core').directive('treeview', treeview);

	/* @ngInject */
	function treeview() {
		angular.element.fn.tree = function() {
			return angular.element(this).each(function() {
				var btn = angular.element(this).children('a').first();
				var menu = angular.element(this).children('.treeview-menu').first();
				var isActive = angular.element(this).hasClass('active');

				// Initialize already active menus
				if (isActive) {
					menu.show();
					btn.children('.fa-angle-left').first().removeClass('fa-angle-left').addClass('fa-angle-down');
				}

				// Slide open or close the menu on link click
				btn.click(function(e) {
					e.preventDefault();
					if (isActive) {
						// Slide up to close menu
						menu.slideUp();
						isActive = false;
						btn.children('.fa-angle-down').first().removeClass('fa-angle-down').addClass('fa-angle-left');
						btn.parent('li').removeClass('active');
					} else {
						// Slide down to open menu
						menu.slideDown();
						isActive = true;
						btn.children('.fa-angle-left').first().removeClass('fa-angle-left').addClass('fa-angle-down');
						btn.parent('li').addClass('active');
					}
				});

				// Add margins to submenu elements to give it a tree look
				menu.find('li > a').each(function() {
					var pad = parseInt(angular.element(this).css('margin-left')) + 10;

					angular.element(this).css({
						'margin-left': pad + 'px'
					});
				});
			});
		};

		return {
			restrict: 'C',
			link: function(scope, element) {
				scope.$on('repeatLastDone', function() {
					angular.element(element).tree();
				});
			}
		};
	}
})();



'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (this.roles.indexOf('*') !== -1) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Add menus
		this.addMenu('admin');
		this.addMenu('user');
		this.addMenu('customer');
		this.addMenu('volunteer');
		this.addMenu('driver');
		this.addMenu('donor');
	}
]);

'use strict';

// Setting up route
angular.module('customer').config(['$stateProvider',
	function($stateProvider){
		// Customer state routing for admin
		$stateProvider.
		state('root.listCustomers', {
			url: 'admin/customers',
			views: {
				'content@': {
					templateUrl: 'modules/customer/views/admin/list-customers.client.view.html',
					controller: 'CustomerAdminController as customerCtrl'
				}
			}
		}).
		state('root.viewCustomerAdmin', {
			url: 'admin/customers/:customerId',
			views: {
				'content@': {
					templateUrl: 'modules/customer/views/view-customer.client.view.html',
					controller: 'CustomerAdminController as customerCtrl'
				}
			}
		}).
		state('root.editCustomerAdmin', {
			url: 'admin/customers/:customerId/edit',
			views: {
				'content@': {
					templateUrl: 'modules/customer/views/edit-customer.client.view.html',
					controller: 'CustomerAdminController as customerCtrl'
				},
				'general-info@root.editCustomerAdmin': {
					templateUrl: 'modules/customer/views/partials/general-info.partial.html'
				},
				'employment@root.editCustomerAdmin': {
					templateUrl: 'modules/customer/views/partials/employment.partial.html'
				},
				'food-preferences@root.editCustomerAdmin': {
					templateUrl: 'modules/customer/views/partials/food-preferences.partial.html'
				},
				'financial@root.editCustomerAdmin': {
					templateUrl: 'modules/customer/views/partials/financial.partial.html'
				},
				'household@root.editCustomerAdmin': {
					templateUrl: 'modules/customer/views/partials/household.partial.html'
				}
			}
		});
	}
]);
'use strict';

// Configuring the Customer module
angular.module('customer').run(['Menus',
	function(Menus) {
		// Set sidebar menu items for admin
		Menus.addMenuItem('admin', 'Client Database', 'admin/customers', 'item', 'root.listCustomers', '', ['admin'], 0);

		// Set sidebar menu items for customer
		Menus.addMenuItem('customer', 'Edit Application', '/edit', 'item', 'root.editCustomerUser({customerId: sidebarCtrl.user._id})', '', ['customer'], 0);
	}
]);

'use strict';

// Setting up route
angular.module('customer').config(['$stateProvider',
	function($stateProvider){
		// Customer state routing for user
		$stateProvider.
		state('root.createCustomerUser', {
			url: 'customer/create',
			views: {
				'content@': {
					templateUrl: 'modules/customer/views/user/create-customer.client.view.html',
					controller: 'CustomerUserController as customerCtrl'
				},
				'general-info@root.createCustomerUser': {
					templateUrl: 'modules/customer/views/partials/general-info.partial.html'
				},
				'employment@root.createCustomerUser': {
					templateUrl: 'modules/customer/views/partials/employment.partial.html'
				},
				'food-preferences@root.createCustomerUser': {
					templateUrl: 'modules/customer/views/partials/food-preferences.partial.html'
				},
				'financial@root.createCustomerUser': {
					templateUrl: 'modules/customer/views/partials/financial.partial.html'
				},
				'household@root.createCustomerUser': {
					templateUrl: 'modules/customer/views/partials/household.partial.html'
				},
				'waiver@root.createCustomerUser': {
					templateUrl: 'modules/customer/views/partials/waiver.partial.html'
				}
			}
		}).
		state('root.createCustomerUser-success', {
			url: 'customer/create/success',
			views: {
				'content@': {
					templateUrl: 'modules/customer/views/user/create-customer-success.client.view.html'
				}
			}
		}).
		state('root.viewCustomerUser', {
			url: 'customer/:customerId',
			views: {
				'content@': {
					templateUrl: 'modules/customer/views/view-customer.client.view.html',
					controller: 'CustomerUserController as customerCtrl'
				}
			}
		}).
		state('root.editCustomerUser', {
			url: 'customer/:customerId/edit',
			views: {
				'content@': {
					templateUrl: 'modules/customer/views/edit-customer.client.view.html',
					controller: 'CustomerUserController as customerCtrl'
				},
				'general-info@root.editCustomerUser': {
					templateUrl: 'modules/customer/views/partials/general-info.partial.html'
				},
				'employment@root.editCustomerUser': {
					templateUrl: 'modules/customer/views/partials/employment.partial.html'
				},
				'food-preferences@root.editCustomerUser': {
					templateUrl: 'modules/customer/views/partials/food-preferences.partial.html'
				},
				'financial@root.editCustomerUser': {
					templateUrl: 'modules/customer/views/partials/financial.partial.html'
				},
				'household@root.editCustomerUser': {
					templateUrl: 'modules/customer/views/partials/household.partial.html'
				}
			}
		});
	}
]);

(function() {
	'use strict';

	CustomerAdminController.$inject = ["$window", "$stateParams", "$state", "Authentication", "CustomerAdmin", "Food"];
	angular.module('customer').controller('CustomerAdminController', CustomerAdminController);

	/* @ngInject */
	function CustomerAdminController($window, $stateParams, $state, Authentication, CustomerAdmin, Food) {
		var self = this,
				user = Authentication.user;

		// This provides Authentication context
		self.authentication = Authentication;

		// Verify is user has admin role, redirect to home otherwise
		if (user && user.roles.indexOf('admin') < 0) $state.go('root');

		self.customer = self.customer || {};

		// Add plugins into datatable
		self.dtOptions = {
			dom: 'TCRlfrtip',
			tableTools: {
        sSwfPath: '/lib/datatables-tabletools/swf/copy_csv_xls.swf',
				aButtons: ['copy', 'xls']
			}
		};

		/**
		 *	Food Preferences
		 */

		// Store selected food categories
		self.foodList = self.foodList || [];

		// Initialize food preferences
		self.customer.foodPreferences = self.customer.foodPreferences || [];

		// Find list of food items and flatten received objects
		self.findFood = function() {
			Food.query({}, function(foods) {
				foods.forEach(function(food) {
					self.foodList = self.foodList.concat(food.items);
				});
			});
		};

		// Toggle selection of all food items
		self.selectAll = function(checked) {
			if (!checked) {
				self.customer.foodPreferences = [];
				self.foodList.forEach(function(item) {
					self.customer.foodPreferences.push(item._id);
				});
			} else {
				self.customer.foodPreferences = [];
			}
		};

		// Check if food item is selected
		self.foodIsChecked = function(selectedFood) {
			if (self.customer.foodPreferences) {
				return self.customer.foodPreferences.indexOf(selectedFood._id) > -1;
			}
		};

		// Store food category when box is checked an remove when unchecked
		self.toggleSelection = function(selectedFood) {
			var index = self.customer.foodPreferences.indexOf(selectedFood._id);
			if (index > -1) {
				self.customer.foodPreferences.splice(index, 1);
			} else {
				self.customer.foodPreferences.push(selectedFood._id);
			}
		};

		/**
		 *	Dependants Section
		 */
		 
		// Store dependants in the household
		self.customer.household = [{
			name: self.customer.firstName + ' ' + self.customer.lastName,
			relationship: 'Applicant',
			dateOfBirth: self.customer.dateOfBirth
		}];

		// Set an array of dependants based on input value
		self.setDependantList = function(numberOfDependants) {
			var temp = angular.copy(self.customer.household);
			self.customer.household = [];
			for (var i = numberOfDependants - 1; i >= 0; i--) {
				self.customer.household[i] = temp[i] || {};	
			}
		};

		/**
		 * Helper Functions
		 */
		 
		// Refactor food item objects into a list of names separated by comma's
		self.splitByComma = function(foodItems) {
			if (foodItems) {
				var temp = [];
				foodItems.forEach(function(itemId) {
					self.foodList.forEach(function(food) {
						if (itemId === food._id) temp.push(food.name);
					});
				});
				return temp.join(', ');
			}
		};

		// Add up totals in Financial Assessment
		self.total = function(data, type) {
			if (data) {
				return data.reduce(function(a, b) {
					return a + b[type];
				}, 0);
			}
		};

		/**
		 * CRUD Functions
		 */
		 
		// Find a list of customers
		self.find = function() {
			self.customers = CustomerAdmin.query();
		};

		// Find existing customer
		self.findOne = function() {
			self.customer = CustomerAdmin.get({
				customerId: $stateParams.customerId
			}, function(customer){
				self.numberOfDependants = customer.household.length;
				self.setDependantList(self.numberOfDependants);
			});
		};

		// Update existing customer
		self.update = function(status) {
			var customer = self.customer;

			if (status) customer.status = status;

			customer.$update(function() {
				// Redirect after update
				$state.go('root.listCustomers');
			}, function(errorResponse) {
				self.error = errorResponse.data.message;
			});
		};
		
		// Delete existing customer
		self.delete = function(customer) {
			if ($window.confirm('Are you sure?')) {
				customer.$delete(function() {
					$state.go('root.listCustomers', null, { reload: true });
				}, function(errorResponse) {
					self.error = errorResponse.data.message;
				});
			}
		};		
	}
})();

(function() {
	'use strict';

	CustomerUserController.$inject = ["$stateParams", "$state", "Authentication", "CustomerUser", "moment", "Data"];
	angular.module('customer').controller('CustomerUserController', CustomerUserController);

	/* @ngInject */
	function CustomerUserController($stateParams, $state, Authentication, CustomerUser, moment, Data) {
		var self = this,
				user = Authentication.user;

		// This provides Authentication context
		self.authentication = Authentication;

		// If user is not signed in redirect to signin
		if (!user) $state.go('root.signin');

		// Redirect to edit if user has already applied
		if (user && user.hasApplied && $state.is('root.createCustomerUser')) $state.go('root.editCustomerUser', { customerId: user._id });

		// Populate customer object if the user has filled an application
		self.customer = self.customer || {};
		angular.extend(self.customer, user);

		/**
		 *	Food Preferences
		 */

		// Store selected food categories
		self.foodList = self.foodList || [];

		// Initialize food preferences
		self.customer.foodPreferences = self.customer.foodPreferences || [];

		// Find list of food items and flatten received objects
		self.findFood = function() {
			CustomerUser.query({}, function(foods) {
				foods.forEach(function(food) {
					self.foodList = self.foodList.concat(food.items);
				});
			});
		};
		
		// Toggle selection of all food items
		self.selectAll = function(checked) {
			if (!checked) {
				self.customer.foodPreferences = [];
				self.foodList.forEach(function(item) {
					self.customer.foodPreferences.push(item._id);
				});
			} else {
				self.customer.foodPreferences = [];
			}
		};

		// Check if food item is selected
		self.foodIsChecked = function(selectedFood) {
			if (self.customer.foodPreferences) {
				return self.customer.foodPreferences.indexOf(selectedFood._id) > -1;
			}
		};

		// Store food category when box is checked an remove when unchecked
		self.toggleSelection = function(selectedFood) {
			var index = self.customer.foodPreferences.indexOf(selectedFood._id);
			if (index > -1) {
				self.customer.foodPreferences.splice(index, 1);
			} else {
				self.customer.foodPreferences.push(selectedFood._id);
			}
		};

		/**
		 *	 Financial Assessment
		 */
		 
		self.customer.employment = self.customer.employment || {};
		self.customer.financialAssessment = self.customer.financialAssessment || {};
		self.customer.financialAssessment.income = self.customer.financialAssessment.income || Data.getIncomeList();
		self.customer.financialAssessment.expenses = self.customer.financialAssessment.expenses || Data.getExpensesList();

		/**
		 *	Dependants Section
		 */

		// Store dependants in the household
		self.customer.household = [{
			name: self.customer.firstName + ' ' + self.customer.lastName,
			relationship: 'Applicant',
			dateOfBirth: self.customer.dateOfBirth
		}];

		// Set an array of dependants based on input value
		self.setDependantList = function(numberOfDependants) {
			var temp = angular.copy(self.customer.household);
			self.customer.household = [];
			for (var i = numberOfDependants - 1; i >= 0; i--) {
				self.customer.household[i] = temp[i] || {};	
			}
		};
		
		/**
		 *	Helper Functions
		 */
		 
		// Refactor food item objects into a list of names separated by comma's
		self.splitByComma = function(foodItems) {
			if (foodItems) { 
				var temp = [];
				foodItems.forEach(function(itemId) {
					self.foodList.forEach(function(food) {
						if (itemId === food._id) temp.push(food.name);
					});
				});
				return temp.join(', ');
			}
		};

		// Add up totals in Financial Assessment
		self.total = function(data, type) {
			if (data) {
				return data.reduce(function(a, b) {
					return a + b[type];
				}, 0);
			}
		};
		
		/**
		 * CRUD Functions
		 */
		
		// Create a new customer
		self.create = function() {
			var customer = new CustomerUser(self.customer);
			delete customer._id;
			user.hasApplied = true;

			customer.$save(function(response) {
				// Redirect after save
				$state.go('root.createCustomerUser-success', null, { reload: true });
			}, function(errorResponse) {
				self.error = errorResponse.data.message;
			});
		};

		// Find existing customer
		self.findOne = function() {
			self.customer = CustomerUser.get({
				customerId: $stateParams.customerId
			}, function(customer){
				self.numberOfDependants = customer.household.length;
				self.setDependantList(self.numberOfDependants);
			});
		};

		// Update existing customer
		self.update = function() {
			var customer = self.customer;

			customer.$update(function() {
				// Redirect after update
				$state.go('root');
			}, function(errorResponse) {
				self.error = errorResponse.data.message;
			});
		};
	}
})();

(function() {
	'use strict';

	angular.module('customer').filter('capitalize', capitalize);

	function capitalize() {
		return capitalizeFilter;

		function capitalizeFilter(input) {
			if (typeof input === 'string') {
				return input.split(' ').map(function(char) {
					return char.charAt(0).toUpperCase() + char.substring(1);
				}).join(' ');
			}
			return input;
		}
	}
})();

(function() {
	'use strict';

	angular.module('customer').filter('splitCamelCase', splitCamelCase);

	function splitCamelCase() {
		return splitCamelCaseFilter;

		function splitCamelCaseFilter(string) {
			return string.replace(/([A-Z])/g, ' $1').replace(/^./, function(char) {
				return char.toUpperCase();
			});
		}
	}
})();

'use strict';

// Customer service used for communicating with the application REST endpoints
angular.module('customer').factory('CustomerUser', ['$resource',
	function($resource) {
		return $resource('customer/:customerId', {
			customerId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]).factory('CustomerAdmin', ['$resource',
	function($resource) {
		return $resource('admin/customers/:customerId', {
			customerId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);


'use strict';

angular.module('customer').factory('Data', [function() {
	var incomeList = [
		{ name: 'Employment Income', self: 0, other: 0 },
		{ name: 'Employment Insurance Benefits', self: 0, other: 0 },
		{ name: 'Social Assistance', self: 0, other: 0 },
		{ name: 'Spousal/Child Support', self: 0, other: 0 },
		{ name: 'Self Employment', self: 0, other: 0 },
		{ name: 'Pension Income (eg. Employer Plan)', self: 0, other: 0 },
		{ name: 'Disability Income', self: 0, other: 0 },
		{ name: 'Workplace Safety and Insurance Board (WSIB) Benefits', self: 0, other: 0 },
		{ name: 'Canada Pension Plan (CPP)', self: 0, other: 0 },
		{ name: 'Child Tax Benefits', self: 0, other: 0 },
		{ name: 'Income from Rental Property', self: 0, other: 0 },
		{ name: 'Severance/Termination Pay', self: 0, other: 0 },
		{ name: 'Any other source of income not listed above', self: 0, other: 0 }
	];

	var expensesList = [
		{ name: 'Rent, mortgage or room and board', value: 0 },
		{ name: 'Food', value: 0 },
		{ name: 'Utilities (phone, internet, water, heat/hydro)', value: 0 },
		{ name: 'Transportation, parking and other personal supports', value: 0 },
		{ name: 'Dependant Care (eg. day care)', value: 0 },
		{ name: 'Disability Needs', value: 0 },
		{ name: 'Spousal/Child support', value: 0 },
		{ name: 'Loans', value: 0 },
		{ name: 'Leases', value: 0 },
		{ name: 'Insurance', value: 0 },
		{ name: 'Credit card debt', value: 0 },
		{ name: 'Property taxes', value: 0 },
		{ name: 'Other costs not listed above', value: 0 }
	];

	return {
		getIncomeList: function() {
			return incomeList;
		},
		getExpensesList: function() {
			return expensesList;
		}
	};
}]);
'use strict';

// Configuring the Donor module
angular.module('donor').run(['Menus',
	function(Menus) {
		// Set sidebar menu items for admin
		Menus.addMenuItem('admin', 'Donor Database and Tax Receipts', 'admin/donors', 'item', 'root.listDonors', '', ['admin'], 6);

		// Set sidebar menu items for donors
		Menus.addMenuItem('donor', 'Edit Application', '/edit', 'item', 'root.editDonorUser({donorId: sidebarCtrl.user._id})', '', ['donor'], 0);
	}
]);

'use strict';

// Setting up route
angular.module('donor').config(['$stateProvider',
	function($stateProvider) {
		// Donor state routing for user
		$stateProvider.
		state('root.createDonorUser', {
			url: 'donor/create',
			views: {
				'content@': {
					templateUrl: 'modules/donor/views/user/create-donor.client.view.html',
					controller: 'DonorUserController as donorCtrl'
				},
				'general-info@root.createDonorUser': {
					templateUrl: 'modules/donor/views/partials/general-info.partial.html'
				}
			}
		}).
		state('root.createDonorUser-success', {
			url: 'donor/create/success',
			views: {
				'content@': {
					templateUrl: 'modules/donor/views/user/create-donor-success.client.view.html'
				}
			}
		}).
		state('root.viewDonorUser', {
			url: 'donor/:donorId',
			views: {
				'content@': {
					templateUrl: 'modules/donor/views/view-donor.client.view.html',
					controller: 'DonorUserController as donorCtrl'
				}
			}
		}).
		state('root.editDonorUser', {
			url: 'donor/:donorId/edit',
			views: {
				'content@': {
					templateUrl: 'modules/donor/views/edit-donor.client.view.html',
					controller: 'DonorUserController as donorCtrl'
				},
				'general-info@root.editDonorUser': {
					templateUrl: 'modules/donor/views/partials/general-info.partial.html'
				}
			}
		});

		// Donor state routing for admin
		$stateProvider.
		state('root.listDonors', {
			url: 'admin/donors',
			views: {
				'content@': {
					templateUrl: 'modules/donor/views/admin/list-donors.client.view.html',
					controller: 'DonorAdminController as donorCtrl'
				}
			}
		}).
		state('root.viewDonorAdmin', {
			url: 'admin/donors/:donorId',
			views: {
				'content@': {
					templateUrl: 'modules/donor/views/view-donor.client.view.html',
					controller: 'DonorAdminController as donorCtrl'
				}
			}
		}).
		state('root.editDonorAdmin', {
			url: 'admin/donors/:donorId/edit',
			views: {
				'content@': {
					templateUrl: 'modules/donor/views/edit-donor.client.view.html',
					controller: 'DonorAdminController as donorCtrl'
				},
				'general-info@root.editDonorAdmin': {
					templateUrl: 'modules/donor/views/partials/general-info.partial.html'
				}
			}
		});
	}
]);

(function() {
	'use strict';

	DonorAdminController.$inject = ["$window", "$modal", "$state", "$stateParams", "Authentication", "DonorAdmin"];
	angular.module('donor').controller('DonorAdminController', DonorAdminController);

	/* @ngInject */
	function DonorAdminController($window, $modal, $state, $stateParams, Authentication, DonorAdmin) {
		var self = this;

		self.donor = {};
		self.donations = [];
		self.donationsCopy = [].concat(self.donations); // Copy data for Smart Table
		self.donors = [];
		self.dtOptions = {};
		self.find = find;
		self.findOne = findOne;
		self.update = update;
		self.newDonation = newDonation;
		self.viewDonation = viewDonation;
		self.remove = remove;
		
		// Verify is user has admin role, redirect to home otherwise
		if (Authentication.user.roles.indexOf('admin') < 0) $state.go('root');

		// Add plugins into datatable
		self.dtOptions = {
			dom: 'Tlfrtip',
			tableTools: {
				sSwfPath: '/lib/datatables-tabletools/swf/copy_csv_xls.swf',
				aButtons: ['copy', 'xls']
			}
		};

		// Find a list of donors
		function find() {
			self.donors = DonorAdmin.query({}, function(donors) {
				// Calculate and add a total donated property for each donor
				donors.forEach(function(donor) {
					donor.totalDonated = 0;

					if (donor.donations && donor.donations.length) {
						donor.totalDonated = donor.donations.reduce(function(prev, curr) {
							return prev + (curr.eligibleForTax || 0);
						}, 0);
					}
				});
			});
		}

		// Find existing donor
		function findOne() {
			DonorAdmin.get({
				donorId: $stateParams.donorId
			}, function(donor) {
				self.donor = donor;
				self.donations = donor.donations;
			});
		}

		// Update donor
		function update() {
			var donor = self.donor;

			donor.$update(function(response) {
				// Redirect after update
				$state.go('root.listDonors');
			}, function(errorResponse) {
				self.error = errorResponse.data.message;
			});
		}
		
		// Delete donor
		function remove(donor) {
			if ($window.confirm('Are you sure?')) {
				donor.$remove(function() {
					$state.go('root.listDonors', null, { reload: true });
				}, function(errorResponse) {
					self.error = errorResponse.data.message;
				});
			}
		}

		// Open donation form in a modal window
		function newDonation() {
			var modalInstance = $modal.open({
				templateUrl: 'modules/donor/views/admin/create-donation.client.view.html',
				controller: 'DonationController as donationCtrl',
				resolve: {
					donationItem: function() {
						return {};
					}
				}
			});

			modalInstance.result.then(function(donation) {
				if (donation) {
					self.donations.push(donation);
					self.update();
				}
			});
		}

		// View donation in a modal window
		function viewDonation(donation) {
			$modal.open({
				templateUrl: 'modules/donor/views/admin/view-donation.client.view.html',
				controller: 'DonationController as donationCtrl',
				resolve: {
					donationItem: function() {
						return donation;
					}
				}
			});
		}
	}
})();

(function() {
	'use strict';

	DonationController.$inject = ["$modalInstance", "$stateParams", "Donation", "donationItem"];
	angular.module('donor').controller('DonationController', DonationController);

	/* @ngInject */
	function DonationController($modalInstance, $stateParams, Donation, donationItem) {
		var self = this;

		self.close = $modalInstance.close;
		self.create = create;
		self.sendEmail = sendEmail;
		self.dismiss = $modalInstance.dismiss;
		self.donation = donationItem;
		self.error = '';

		function create() {
			var donation = self.donation;

			Donation.saveDonation(donation)
				.then(function(response) {
					self.close(response.data);
				})
				.catch(function(errorResponse) {
					self.error = errorResponse.data.message;
				})
			;
		}
		
		function sendEmail() {
			var donation = self.donation;
					
			Donation.sendReceipt(donation)
				.then(function(response) {
					self.close();
				})
				.catch(function(errorResponse) {
					self.error = errorResponse.data.message;
				})
			;
		}
		
	}
})();

(function() {
	'use strict';

	DonorUserController.$inject = ["$stateParams", "$state", "Authentication", "DonorUser"];
	angular.module('donor').controller('DonorUserController', DonorUserController);

	/* @ngInject */
	function DonorUserController($stateParams, $state, Authentication, DonorUser) {
		var self = this,
				user = Authentication.user;

		// This provides Authentication context
		self.authentication = Authentication;

		// If user is not signed in redirect to signin
		if(!user) $state.go('root.signin');

		// Redirect to edit if user has already applied
		if (user && user.hasApplied && $state.is('root.createDonorUser')) $state.go('root.editDonorUser', { donorId: user._id });

		// Populate donor object if the user has filled an application
		self.donor = Authentication.user;

		// Create a new donor
		self.create = function() {
			var donor = new DonorUser(self.donor);
			delete donor._id;
			self.donor.hasApplied = true;

			donor.$save(function(response) {
				// Redirect after save
				$state.go('root.createDonorUser-success', null, { reload: true });
			}, function(errorResponse) {
				self.error = errorResponse.data.message;
			});
		};

		// Find existing donor
		self.findOne = function() {
			self.donor = DonorUser.get({
				donorId: $stateParams.donorId
			});
		};

		// Update existing donor
		self.update = function() {
			var donor = self.donor;

			donor.$update(function() {
				// Redirect after update
				$state.go('root');
			}, function(errorResponse) {
				self.error = errorResponse.data.message;
			});
		};
	}
})();

(function() {
	'use strict';

	// Donation service used for communicating with the donation REST endpoints
	Donation.$inject = ["$http", "$stateParams"];
	angular.module('donor').factory('Donation', Donation);
	
	/* @ngInject */
	function Donation($http, $stateParams) {
		var service = {
			saveDonation: saveDonation,
			sendReceipt: sendReceipt
		};
		
		return service;
		
		function saveDonation(donation) {
			return $http.post('admin/donations', donation);
		}
		
		function sendReceipt(donation) {
			return $http.put('admin/donations/' + $stateParams.donorId, donation);
		}
	}
})();


'use strict';

// Donor service used for communicating with the donor REST endpoints
angular.module('donor').factory('DonorUser', ['$resource',
	function($resource) {
		return $resource('donor/:donorId', {
			donorId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]).factory('DonorAdmin', ['$resource',
	function($resource) {
		return $resource('admin/donors/:donorId', {
			donorId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

// Configuring the Driver menu
angular.module('driver').run(['Menus',
	function(Menus) {
		// Set sidebar menu items for admin
		Menus.addMenuItem('admin', 'Drivers and Route Assignment', 'admin/drivers', 'treeview', 'root.driver', '', ['admin'], 4);
		Menus.addSubMenuItem('admin', 'admin/drivers', 'Drivers', 'admin/drivers', 'root.driver.admin', '', ['admin'], 0);
		Menus.addSubMenuItem('admin', 'admin/drivers', 'Route Assignment', 'admin/drivers/routes', 'root.driver.routes', '', ['admin'], 1);

		// Set sidebar menu items for drivers
		Menus.addMenuItem('driver', 'Edit Application', '/edit', 'item', 'root.editVolunteerUser', '', ['driver'], 0);
		Menus.addMenuItem('driver', 'Route Assignment', 'driver/routes', 'item', 'root.driver.user', '', ['driver'], 1);
	}
]);

// Configuring Google Maps
angular.module('driver').config(['uiGmapGoogleMapApiProvider',
	function(uiGmapGoogleMapApiProvider) {
		uiGmapGoogleMapApiProvider.configure({
			//key: 'insert key',
			v: '3.19',
			libraries: 'geometry, visualization'
		});
	}
]);

'use strict';

// Setting up routes
angular.module('driver').config(['$stateProvider',
	function($stateProvider) {
		$stateProvider.
		state('root.driver', {
			abstract: true
		}).
		// Driver state routing for user
		state('root.driver.user', {
			url: 'driver/routes',
			views: {
				'content@': {
					templateUrl: 'modules/driver/views/user-driver.client.view.html',
					controller: 'DriverUserController as driverCtrl'
				}
			}
		}).
		// Driver state routing for admin
		state('root.driver.admin', {
			url: 'admin/drivers',
			views: {
				'content@': {
					templateUrl: 'modules/driver/views/admin-driver.client.view.html',
					controller: 'DriverAdminController as driverCtrl'
				}
			}
		}).
		state('root.driver.routes', {
			url: 'admin/drivers/routes',
			views: {
				'content@': {
					templateUrl: 'modules/driver/views/routes-driver.client.view.html',
					controller: 'DriverRouteController as driverCtrl'
				}
			}
		});
	}
]);

(function() {
	'use strict';

	ListDriversController.$inject = ["VolunteerAdmin", "moment"];
	angular.module('driver').controller('DriverAdminController', ListDriversController);

	/* @ngInject */
	function ListDriversController(VolunteerAdmin, moment) {
		var self = this;

		//=== Bindable variables ===//
		self.drivers = {};
		self.driversCopy = [].concat(self.drivers); // Copy data for smart table
		self.isLoading = true;

		//=== Private variables ===//
		moment = moment.utc;
		var beginWeek = moment().startOf('isoWeek'); // Store the date of this week's Monday

		findDrivers();

		function findDrivers() {
			// Set loading state
			self.isLoading = true;

			VolunteerAdmin.query({}, function(volunteers) {
				self.drivers = volunteers.filter(function(volunteer) {
					return volunteer.driver;
				}).map(function(driver) {
					driver.deliveryStatus = driver.customers.every(function(customer) {
						return moment(customer.lastDelivered).isSame(beginWeek);
					});
					driver.deliveryStatus = driver.deliveryStatus ? 'In progress' : 'Completed';
					return driver;
				});

				// Remove loading state
				self.isLoading = false;
			});
		}
	}
})();

(function() {
	'use strict';

	DriverAdminController.$inject = ["$filter", "CustomerAdmin", "VolunteerAdmin", "uiGmapGoogleMapApi"];
	angular.module('driver').controller('DriverRouteController', DriverAdminController);

	/* @ngInject */
	function DriverAdminController($filter, CustomerAdmin, VolunteerAdmin, uiGmapGoogleMapApi) {
		var self = this;

		//=== Bindable variables ===//
		self.assign = assign;
		self.customers = {};
		self.customersCopy = [].concat(self.customers); // Copy data for smart table
		self.driver = null;
		self.drivers = {};
		self.error = {};
		self.isDisabled = isDisabled;
		self.isLoading = null;
		self.map = {};

		//=== Private variables ===//
		var markers = []; // Store google markers

		findDrivers(); // Start the chain

		//=== START Function chain ===//
		// 1. Find a list of drivers
		function findDrivers() {
			// Set loading state
			self.isLoading = true;

			VolunteerAdmin.query({}, function(volunteers) {
				self.drivers = volunteers.filter(function(volunteer) {
					return volunteer.driver;
				});
				// Trigger next function in the chain
				findCustomers();
			});
		}

		// 2. Find a list of customers
		function findCustomers() {
			CustomerAdmin.query({}, function(customers) {
				self.customers = customers.filter(function(customer) {
					return customer.status === 'Accepted';
				});
				// Trigger next function in the chain
				createMarkers();
			});
		}

		// 3. Configure google markers for each customer
		function createMarkers() {
			// marker icons
			var iconUrlBlue = 'modules/driver/images/gm-marker-blue.png';
			var iconUrlPink = 'modules/driver/images/gm-marker-pink.png';

			// min/max values for nudging markers who are on the same spot
			var min = 0.999999;
			var max = 1.000001;

			self.customers.forEach(function(customer) {
				var marker = {
					latitude: customer.location[1] * (Math.random() * (max - min) + min),
					longitude: customer.location[0] * (Math.random() * (max - min) + min),
					id: customer._id,
					icon: iconUrlPink,
					events: {
						click: function() {
							customer.isChecked = !customer.isChecked;
							marker.icon = customer.isChecked ? iconUrlBlue : iconUrlPink;
						},
						mouseover: function(marker, eventName, model) {
							var content = '<h4><strong>' + customer._id + '</strong> ' + customer.address + '</h4>';

							self.map.window.marker = model;
							self.map.window.options.content = content;
							self.map.window.show = true;
						},
						mouseout: function() {
							self.map.window.show = false;
						}
					}
				};
				markers.push(marker);
			});
			// Trigger next function in the chain
			renderMap();
		}

		// 4. Render and configure google maps
		function renderMap() {
			uiGmapGoogleMapApi.then(function () {
				var geoToronto = {
					latitude: 43.8108899,
					longitude: -79.449906
				};

				self.map = {
					center: geoToronto,
					zoom: 12,
					markers: markers,
					window: {
						marker: {},
						show: false,
						options: {
							content: '',
							pixelOffset: {
								height: -40,
								width: 0
							}
						}
					}
				};
				// Remove loading state
				self.isLoading = false;
			});
		}
		//=== END Function chain ===//

		// Assign customers to drivers
		function assign() {
			// Set loading state
			self.isLoading = true;
			// Keep track of server calls that haven't returned yet
			var updatesInProgress = 0;

			var driver = self.driver;
			var oldDrivers = [];

			self.customers.filter(function(customer) {
				return customer.isChecked;
			}).forEach(function(customer) {
				// If assigned driver is different from the one to be assigned
				if (customer.assignedTo && customer.assignedTo._id !== driver._id) {
					var oldDriver = {};
					self.drivers.some(function(driver) {
						if (driver._id === customer.assignedTo._id) {
							oldDriver = driver;
							return true;
						}
						return false;
					});

					// Remove customer from old driver
					oldDriver.customers.splice(oldDriver.customers.indexOf(customer._id), 1);

					// Add driver to be updated later, if it hasn't been added yet
					if (oldDrivers.length) {
						var containsDriver = oldDrivers.some(function(driver) {
							return driver._id === oldDriver._id;
						});
						if (!containsDriver) oldDrivers.push(oldDriver);
					} else {
						oldDrivers.push(oldDriver);
					}
				}

				// Update customer only if hasn't been assigned yet or if driver is changing
				if (!customer.assignedTo || customer.assignedTo._id !== driver._id) {
					// Add assigned customer to new driver
					driver.customers.push(customer._id);

					// Update customer with new driver
					customer.assignedTo = driver._id;
					updatesInProgress++;
					customer.$update(function() {
						// Subtract server call upon return
						updatesInProgress--;
						// If all customers and driver updates have returned from the server then we can
						// render the view again by starting the function chain
						// Note: This will trigger only once, depending on which callback comes in last,
						// which is why it's in both the customer and driver callbacks
						if (!updatesInProgress) findDrivers();
					}, function(errorResponse) {
						self.error = errorResponse.data.message;
					});
				}
			});

			// Update old drivers
			if (oldDrivers.length) {
				oldDrivers.forEach(function(driver) {
					updatesInProgress++;
					driver.$update(function() {
						// Subtract server call upon return
						updatesInProgress--;
						if (!updatesInProgress) findDrivers();
					}, function(errorResponse) {
						self.error = errorResponse.data.message;
					});
				});
			}

			// Update new driver
			updatesInProgress++;
			driver.$update(function() {
				// Subtract server call upon return
				updatesInProgress--;
				// If all customers and driver updates have returned from the server then we can
				// render the view again by starting the function chain
				// Note: This will trigger only once, depending on which callback comes in last,
				// which is why it's in both the customer and driver callbacks
				if (!updatesInProgress) findDrivers();
			}, function(errorResponse) {
				self.error = errorResponse.data.message;
			});
		}

		//=== Helper functions ===//
		// Enable assign button if any of the checkboxes are checked
		function isDisabled(assignForm) {
			if (self.customers) {
				return !$filter('filter')(self.customers, {isChecked: true}).length || assignForm.$invalid;
			}
		}
	}
})();

(function() {
	'use strict';

	DriverUserController.$inject = ["$filter", "Authentication", "VolunteerUser", "CustomerAdmin", "moment"];
	angular.module('driver').controller('DriverUserController', DriverUserController);

	/* @ngInject */
	function DriverUserController($filter, Authentication, VolunteerUser, CustomerAdmin, moment) {
		var self = this;

		var user = Authentication.user;

		//=== Bindable variables ===//
		self.allChecked = false;
		self.customers = {};
		self.customersCopy = [].concat(self.customers); // Copy data for smart table
		self.deliver = deliver;
		self.driver = {};
		self.error = {};
		self.isDisabled = isDisabled;
		self.isLoading = null;
		self.updateNotes = updateNotes;

		//=== Private variables ===//
		moment = moment.utc;
		var beginWeek = moment().startOf('isoWeek'); // Store the date of this week's Monday

		findCustomers();

		// Find a list of customers
		function findCustomers() {
			// Set loading state
			self.isLoading = true;
			VolunteerUser.get({
				volunteerId: user._id
			}, function(volunteer) {
				self.driver = volunteer;
				self.customers = volunteer.customers.filter(function(customer) {
					// Select only customers that have been packed but not delivered yet
					return moment(customer.lastPacked).isSame(beginWeek) &&
						!moment(customer.lastDelivered).isSame(beginWeek);
				});
				// Remove loading state
				self.isLoading = false;
			});
		}

		// Mark customers as delivered
		function deliver() {
			// Set loading state
			self.isLoading = true;
			// Keep track of server calls that haven't returned yet
			var updatesInProgress = 0;

			var driver = self.driver;

			self.customers.filter(function(customer) {
				return customer.isChecked;
			}).forEach(function(customerOld) {
				var customer = new CustomerAdmin(customerOld);

				// Update delivered date to this week
				customer.lastDelivered = beginWeek;
				// Add server call
				updatesInProgress++;

				customer.$update(function() {
					// Subtract server call upon return
					updatesInProgress--;
					// If all customers and driver updates have returned from the server then we can
					// render the view again
					// Note: This will trigger only once, depending on which callback comes in last,
					// which is why it's in both the customer and driver callbacks
					if (!updatesInProgress) findCustomers();
				}, function(errorResponse) {
					self.error = errorResponse.data.message;
				});
			});
		}

		// Update general notes
		function updateNotes() {
			// Set loading state
			self.isLoading = true;

			var driver = self.driver;
			driver.generalNotes = driver.newNotes;

			driver.$update(function() {
				findCustomers();
			}, function(errorResponse) {
				self.error = errorResponse.data.message;
			});
		}

		//=== Helper functions ===//
		// Enable button if any of the checkboxes are checked
		function isDisabled() {
			if (self.customers) {
				return !$filter('filter')(self.customers, {isChecked: true}).length;
			}
		}

		// Select all checkboxes
		self.selectAll = function() {
			self.customers.forEach(function(customer) {
				customer.isChecked = !self.allChecked;
			});
		};
	}
})();

'use strict';

// Configuring the Food module
angular.module('food').run(['Menus',
	function(Menus) {
		// Set sidebar menu items for admin
		Menus.addMenuItem('admin', 'Inventory', 'admin/foods', 'item', 'root.foods', '', ['admin'], 3);
	}
]);

'use strict';

// Setting up routes
angular.module('food').config(['$stateProvider',
	function($stateProvider) {
		// Food state routing
		$stateProvider.
		state('root.foods', {
			url: 'admin/foods',
			views: {
				'content@': {
					templateUrl: 'modules/food/views/foods.client.view.html',
					controller: 'FoodController as foodCtrl'
				}
			}
		});
	}
]);

(function() {
	'use strict';

	FoodController.$inject = ["Food", "FoodItem"];
	angular.module('food').controller('FoodController', FoodController);

	/* @ngInject */
	function FoodController(Food, FoodItem) {
		var self = this;

		// Copy food item for smart table
		self.itemsCopy = [].concat(self.items);

		// Create food item
		self.createItem = function() {
			var item = new FoodItem(self.item);

			item.$save(function() {
				// If successful refresh the table
				self.find();
				// Clear input fields
				delete self.item;
			}, function(errorResponse) {
				self.errorItem = errorResponse.data.message;
			});
		};

		// Update current food item
		self.updateItem = function(selectedItem) {
			var item = new FoodItem(selectedItem);

			item.$update(function() {
				// If successful refresh the table
				self.find();
			}, function(errorResponse) {
				self.errorItem = errorResponse.data.message;
			});
		};

		// Remove current food item
		self.removeItem = function(selectedItem) {
			var item = new FoodItem(selectedItem);

			item.$remove(function() {
				// If successful refresh the table
				self.find();
			}, function (errorResponse) {
				self.errorItem = errorResponse.data.message;
			});
		};

		// Create food category
		self.create = function() {
			var food = new Food(self.food);

			food.$save(function() {
				// If successful refresh the table
				self.find();
				// Clear input fields
				delete self.food;
			}, function(errorResponse) {
				self.error = errorResponse.data.message;
			});
		};

		// Find list of food categories and items
		self.find = function() {
			// Set loading state
			self.isLoading = true;

			Food.query({}, function (foods) {
				self.foods = foods;
				// Flatten obtained data for ng-repeat
				self.items = [];
				for (var food in foods) {
					food = foods[food];
					if (food.items) {
						for (var item in food.items) {
							item = food.items[item];
							item.categoryName = food.category;
							item.categoryId = food._id;
							item.categoryIdOld = food._id;
							self.items.push(item);
						}
					}
				}
				// Remove loading state after callback from the server
				self.isLoading = false;
			});
			// Remove error messages
			delete self.error;
			delete self.errorItem;
		};

		// Update current food category
		self.update = function(food) {
			food.$update(function() {
				// If successful refresh the table
				self.find();
			}, function(errorResponse) {
				self.error = errorResponse.data.message;
			});
		};

		// Remove current food category
		self.remove = function(food) {
			food.$remove(function() {
				// If successful refresh the table
				self.find();
			}, function (errorResponse) {
				self.error = errorResponse.data.message;
			});
		};
	}
})();

'use strict';

// Food service used for communicating with the food REST endpoints
angular.module('food').factory('Food', ['$resource',
	function($resource) {
		return $resource('admin/foods/:foodId', {
			foodId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]).factory('FoodItem', ['$resource',
	function($resource) {
		return $resource('admin/foods/:foodId/items/:itemId', {
			foodId: '@categoryId',
			itemId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

// Configuring the Packing module
angular.module('packing').run(['Menus',
	function(Menus) {
		// Set sidebar menu items for admin
		Menus.addMenuItem('admin', 'Packing List', 'admin/packing', 'item', 'root.packing', '', ['admin'], 2);
	}
]);

'use strict';

// Setting up routes
angular.module('packing').config(['$stateProvider',
	function($stateProvider) {
		// Packing state routing
		$stateProvider.
		state('root.packing', {
			url: 'admin/packing',
			views: {
				'content@': {
					templateUrl: 'modules/packing/views/packing.client.view.html',
					controller: 'PackingController as packingCtrl'
				}
			}
		});
	}
]);

(function() {
	'use strict';

	PackingController.$inject = ["$filter", "Food", "FoodItem", "CustomerAdmin", "moment"];
	angular.module('packing').controller('PackingController', PackingController);

	/* @ngInject */
	function PackingController($filter, Food, FoodItem, CustomerAdmin, moment) {
		var self = this;

		// Copy data for smart table
		self.customersCopy = [].concat(self.customers);

		// Store the date of this week's Monday
		moment = moment.utc;
		var beginWeek = moment().startOf('isoWeek');

		//=== START chain of functions ===//
		// 1. Find a list of food items
		self.find = function() {
			// Set loading state
			self.isLoading = true;

			Food.query({}, function (foods) {
				// Flatten obtained data for ng-repeat
				self.items = [];
				for (var food in foods) {
					food = foods[food];
					if (food.items) {
						for (var item in food.items) {
							item = food.items[item];
							// Attach category props to the item object
							item.categoryName = food.category;
							item.categoryId = food._id;
							// Count property to keep track of distribution quantity for this week
							item.toBeDistributed = 0;
							self.items.push(item);
						}
					}
				}
				// Trigger next function in the chain
				selectItems();
			});
			// Remove error messages
			delete self.error;
		};

		// 2. Select all items that are scheduled for distribution this week
		function selectItems() {
			self.allItems = self.items.filter(function(item) {
				// Check if the item has a schedule planned
				if (item.frequency) {
					// Construct a moment recurring object based on the starting date and frequency from schedule
					var interval = moment(item.startDate).recur().every(item.frequency).weeks();
					// Return true only if the current week matches one of the recurring dates
					return interval.matches(beginWeek);
				}
			});
			// Trigger next function in the chain
			findCustomers();
		}

		// 3. Find a list of customers and filter based on status and last packed date
		function findCustomers() {
			CustomerAdmin.query({}, function(customers) {
				self.customers = customers.filter(function(customer) {
					// If the packed date equals this week's date then the customer package
					// has already been packed for this week
					return !moment(customer.lastPacked).isSame(beginWeek) && (customer.status === 'Accepted') ;
				});
				// Trigger next function in the chain
				getFoodItems();
			});
		}

		// 4. Figure out which food items should be in the packing list
		function getFoodItems() {
			self.customers.forEach(function(customer) {
				customer.packingList = self.allItems.filter(function(item) {
					// Condition checks if the item is part of the customer's food preference
					if (customer.foodPreferences.indexOf(item._id) > -1) {
						item.toBeDistributed++;
						return item;
					}
				});
			});
			// Trigger next function in the chain
			verifyInventory();
		}

		// 5. Verify if there is enough inventory stock to support the packing lists
		function verifyInventory() {
			// Flag variable to keep track of change in the items array
			var changed = false;
			self.allItems = self.allItems.filter(function(item) {
				// Check if the amount to be distributed exceeds current inventory
				if (item.toBeDistributed > item.quantity) {
					changed = true;
					return null;
				}
				return item;
			});
			if (changed) {
				// Go back to #4 and generate a new packing list
				getFoodItems();
			} else {
				// Remove loading state
				self.isLoading = false;
			}
		}
		//=== END chain of functions ===//

		// Update customers and subtract inventory stock
		self.update = function() {
			// Set loading state
			self.isLoading = true;
			// Keep track of server calls that haven't returned yet
			var updatesInProgress = 0;

			self.customers.forEach(function(customer) {
				if (customer.isChecked) {
					customer.packingList.forEach(function(itemCustomer) {
						self.allItems.some(function(item) {
							if (item._id === itemCustomer._id) {
								// For each item in the customer's packing list, subtract quantity by 1
								item.quantity--;
								// Keep track of which items have changed and need to be updated to the server
								item.isPacked = true;
								return true;
							}
							return false;
						});
					});
					// Update the packed date to this week
					customer.lastPacked = beginWeek;
					// Add server call
					updatesInProgress++;
					customer.$update(function() {
						// Subtract server call upon return
						updatesInProgress--;
						// If all item and customer updates have returned from the server then we can
						// render the table again by initiating a find using the updated data
						// Note: This will trigger only once, depending on which callback comes in last,
						// which is why it's in both the customer and item callbacks
						if (!updatesInProgress) self.find();
					}, function(errorResponse) {
						self.error = errorResponse.data.message;
					});
				}
			});

			self.allItems.forEach(function(item) {
				if (item.isPacked) {
					item = new FoodItem(item);

					// Add server call
					updatesInProgress++;
					item.$update(function() {
						// Subtract server call upon return
						updatesInProgress--;
						// If all item and customer updates have returned from the server then we can
						// render the table again by initiating a find using the updated data
						// Note: This will trigger only once, depending on which callback comes in last,
						// which is why it's in both the customer and item callbacks
						if (!updatesInProgress) self.find();
					}, function(errorResponse) {
						self.error = errorResponse.data.message;
					});
				}
			});
		};

		//=== Helper functions
		// Determine column span of empty cells
		self.getColSpan = function(customer) {
			if (self.allItems && customer.packingList) {
				return self.allItems.length - customer.packingList.length;
			}
			return 1;
		};

		// Select all checkboxes
		self.selectAll = function() {
			self.customers.forEach(function(customer) {
				customer.isChecked = !self.allSelected;
			});
		};

		// Enable submit button if any of the checkboxes are checked
		self.isDisabled = function() {
			return self.customers ? !$filter('filter')(self.customers, {isChecked: true}).length : true;
		};
	}
})();

'use strict';

// Configuring the Schedule module
angular.module('schedule').run(['Menus',
	function(Menus) {
		// Set sidebar menu items for admin
		Menus.addMenuItem('admin', 'Food Schedule', 'admin/schedules', 'item', 'root.schedules', '', ['admin'], 1);
	}
]);

'use strict';

// Setting up routes
angular.module('schedule').config(['$stateProvider',
	function($stateProvider) {
		// Schedule state routing
		$stateProvider.
		state('root.schedules', {
			url: 'admin/schedules',
			views: {
				'content@': {
					templateUrl: 'modules/schedule/views/schedules.client.view.html',
					controller: 'ScheduleController as scheduleCtrl'
				}
			}
		});
	}
]);

(function() {
	'use strict';

	ScheduleController.$inject = ["Food", "FoodItem", "moment"];
	angular.module('schedule').controller('ScheduleController', ScheduleController);

	/* @ngInject */
	function ScheduleController(Food, FoodItem, moment) {
		var self = this;

		// Copy food item for smart table
		self.itemsCopy = [].concat(self.items);

		//=== Private variables ===//
		moment = moment.utc;

		// Find list of food items
		self.find = function() {
			// Set loading state
			self.isLoading = true;

			Food.query({}, function (foods) {
				// Flatten obtained data for ng-repeat
				self.items = [];
				for (var food in foods) {
					food = foods[food];
					if (food.items) {
						for (var item in food.items) {
							item = food.items[item];
							item.categoryName = food.category;
							item.categoryId = food._id;
							// Format date object into string
							item.startDate = moment(item.startDate).format('YYYY-[W]W');
							self.items.push(item);
						}
					}
				}
				// Remove loading state after callback from the server
				self.isLoading = false;
			});
			// Remove error message
			delete self.error;
		};

		// Update current food item
		self.update = function(selectedItem) {
			// Parse string back into date object
			selectedItem.startDate = moment(selectedItem.startDate);
			var item = new FoodItem(selectedItem);

			item.$update(function() {
				// If successful refresh the table
				self.find();
			}, function(errorResponse) {
				self.error = errorResponse.data.message;
			});
		};
	}
})();

'use strict';

// Configuring the User menu
angular.module('users').run(['Menus',
	function(Menus) {
		// Set sidebar menu items for users
		Menus.addMenuItem('user', 'Apply', '/create', 'item', 'root.createREPLACETYPEUser', '', ['user'], 0);
		Menus.addMenuItem('user', 'Edit Application', '/edit', 'item', 'root.editREPLACETYPEUser({REPLACEIDId: sidebarCtrl.user._id})', '', ['user'], 0);
	}
]);

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// 403 Unauthorized behaviour
								$location.path('403');	
								break;
							case 500:
								// 500 Server error
								$location.path('500');
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);


'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('root.profile', {
			url: 'settings/profile',
			views: {
				'content@': {
					templateUrl: 'modules/users/views/settings/edit-profile.client.view.html',
					controller: 'SettingsController as settingsCtrl'
				}
			}
		}).
		state('root.password', {
			url: 'settings/password',
			views: {
				'content@': {
					templateUrl: 'modules/users/views/settings/change-password.client.view.html',
					controller: 'SettingsController as settingsCtrl'
				}
			}
		}).
		state('root.accounts', {
			url: 'settings/accounts',
			views: {
				'content@': {
					templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
				}
			}
		}).
		state('root.signup', {
			url: 'signup',
			views: {
				'content@': {
					templateUrl: 'modules/users/views/authentication/signup.client.view.html',
					controller: 'AuthenticationController as authenticationCtrl'
				}
			}
		}).
		state('root.signin', {
			url: 'signin',
			views: {
				'content@': {
					templateUrl: 'modules/users/views/authentication/signin.client.view.html',
					controller: 'AuthenticationController as authenticationCtrl'
				}
			}
		}).
		state('root.forgot', {
			url: 'password/forgot',
			views: {
				'content@': {
					templateUrl: 'modules/users/views/password/forgot-password.client.view.html',
					controller: 'PasswordController as passwordCtrl'
				}
			}
		}).
		state('root.reset-invalid', {
			url: 'password/reset/invalid',
			views: {
				'content@': {
					templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
				}
			}
		}).
		state('root.reset-success', {
			url: 'password/reset/success',
			views: {
				'content@': {
					templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
				}
			}
		}).
		state('root.reset', {
			url: 'password/reset/:token',
			views: {
				'content@': {
					templateUrl: 'modules/users/views/password/reset-password.client.view.html',
					controller: 'PasswordController as passwordCtrl'
				}
			}
		});
	}
]);

(function() {
	'use strict';

	AuthenticationController.$inject = ["$http", "Authentication", "$state"];
	angular.module('users').controller('AuthenticationController', AuthenticationController);

	/* @ngInject */
	function AuthenticationController($http, Authentication, $state) {
		var self = this;

		self.authentication = Authentication;

		// If user is signed in then redirect back home
		if (self.authentication.user) $state.go('root');

		self.signup = function() {
			$http.post('/auth/signup', self.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				self.authentication.user = response;
				
				var accountType = response.accountType[0].charAt(0).toUpperCase() + response.accountType[0].slice(1);
				 
				// And redirect to create application state
				$state.go('root.create' + accountType + 'User', null, { reload: true });
			}).error(function(response) {
				self.error = response.message;
			});
		};

		self.signin = function() {
			$http.post('/auth/signin', self.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				self.authentication.user = response;
				
				var accountType = response.accountType[0].charAt(0).toUpperCase() + response.accountType[0].slice(1);
				
				// And redirect to create application or root state
				if (self.authentication.user.roles[0] === 'admin') {
					$state.go('root', null, { reload: true });
				} else {
					$state.go('root.create' + accountType + 'User', null, { reload: true });
				}
			}).error(function(response) {
				self.error = response.message;
			});
		};
	}
})();

(function() {
	'use strict';

	PasswordController.$inject = ["$stateParams", "$http", "$state", "Authentication"];
	angular.module('users').controller('PasswordController', PasswordController);

	/* @ngInject */
	function PasswordController($stateParams, $http, $state, Authentication) {
		var self = this;

		self.authentication = Authentication;

		//If user is signed in then redirect back home
		if (self.authentication.user) $state.go('root');

		// Submit forgotten password account id
		self.askForPasswordReset = function() {
			self.success = self.error = null;

			$http.post('/auth/forgot', self.credentials).success(function(response) {
				// Show user success message and clear form
				self.credentials = null;
				self.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				self.credentials = null;
				self.error = response.message;
			});
		};

		// Change user password
		self.resetUserPassword = function() {
			self.success = self.error = null;

			$http.post('/auth/reset/' + $stateParams.token, self.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				self.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$state.go('root.reset-success', null, { reload: true });
			}).error(function(response) {
				self.error = response.message;
			});
		};
	}
})();

(function() {
	'use strict';

	SettingsController.$inject = ["$http", "$location", "Users", "Authentication"];
	angular.module('users').controller('SettingsController', SettingsController);

	/* @ngInject */
	function SettingsController($http, $location, Users, Authentication) {
		var self = this;

		self.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!self.user) $location.path('/');

		// Update a user profile
		self.updateUserProfile = function(isValid) {
			if (isValid) {
				self.success = self.error = null;
				var user = new Users(self.user);

				user.$update(function(response) {
					self.success = true;
					Authentication.user = response;
				}, function(response) {
					self.error = response.data.message;
				});
			} else {
				self.submitted = true;
			}
		};

		// Change user password
		self.changeUserPassword = function() {
			self.success = self.error = null;

			$http.post('/users/password', self.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				self.success = true;
				self.passwordDetails = null;
			}).error(function(response) {
				self.error = response.message;
			});
		};
	}
})();

'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Configuring the Volunteer module
angular.module('volunteer').run(['Menus',
	function(Menus) {
		// Set sidebar menu items for admin
		Menus.addMenuItem('admin', 'Volunteer Database', 'admin/volunteers', 'item', 'root.listVolunteers', '', ['admin'], 5);

		// Set sidebar menu items for volunteers
		Menus.addMenuItem('volunteer', 'Edit Application', '/edit', 'item', 'root.editVolunteerUser({volunteerId: sidebarCtrl.user._id})', '', ['volunteer'], 0);
	}
]);

'use strict';

// Setting up route
angular.module('volunteer').config(['$stateProvider',
	function($stateProvider) {
		// Volunteer state routing for user
		$stateProvider.
		state('root.createVolunteerUser', {
			url: 'volunteer/create',
			views: {
				'content@': {
					templateUrl: 'modules/volunteer/views/user/create-volunteer.client.view.html',
					controller: 'VolunteerUserController as volunteerCtrl'
				},
				'general-info@root.createVolunteerUser': {
					templateUrl: 'modules/volunteer/views/partials/general-info.partial.html'
				}
			}
		}).
		state('root.createVolunteerUser-success', {
			url: 'volunteer/create/success',
			views: {
				'content@': {
					templateUrl: 'modules/volunteer/views/user/create-volunteer-success.client.view.html'
				}
			}
		}).
		state('root.viewVolunteerUser', {
			url: 'volunteer/:volunteerId',
			views: {
				'content@': {
					templateUrl: 'modules/volunteer/views/view-volunteer.client.view.html',
					controller: 'VolunteerUserController as volunteerCtrl'
				}
			}
		}).
		state('root.editVolunteerUser', {
			url: 'volunteer/:volunteerId/edit',
			views: {
				'content@': {
					templateUrl: 'modules/volunteer/views/edit-volunteer.client.view.html',
					controller: 'VolunteerUserController as volunteerCtrl'
				},
				'general-info@root.editVolunteerUser': {
					templateUrl: 'modules/volunteer/views/partials/general-info.partial.html'
				}
			}
		});

		// Volunteer state routing for admin
		$stateProvider.
		state('root.listVolunteers', {
			url: 'admin/volunteers',
			views: {
				'content@': {
					templateUrl: 'modules/volunteer/views/admin/list-volunteers.client.view.html',
					controller: 'VolunteerAdminController as volunteerCtrl'
				}
			}
		}).
		state('root.viewVolunteerAdmin', {
			url: 'admin/volunteers/:volunteerId',
			views: {
				'content@': {
					templateUrl: 'modules/volunteer/views/view-volunteer.client.view.html',
					controller: 'VolunteerAdminController as volunteerCtrl'
				}
			}
		}).
		state('root.editVolunteerAdmin', {
			url: 'admin/volunteers/:volunteerId/edit',
			views: {
				'content@': {
					templateUrl: 'modules/volunteer/views/edit-volunteer.client.view.html',
					controller: 'VolunteerAdminController as volunteerCtrl'
				},
				'general-info@root.editVolunteerAdmin': {
					templateUrl: 'modules/volunteer/views/partials/general-info.partial.html'
				}
			}
		});
	}
]);

(function() {
	'use strict';

	VolunteerAdminController.$inject = ["$window", "$stateParams", "$state", "Authentication", "VolunteerAdmin"];
	angular.module('volunteer').controller('VolunteerAdminController', VolunteerAdminController);

	/* @ngInject */
	function VolunteerAdminController($window, $stateParams, $state, Authentication, VolunteerAdmin) {
		var self = this;

		// This provides Authentication context
		self.authentication = Authentication;

		// Verify if user has admin role, redirect to home otherwise
		if (self.authentication.user.roles.indexOf('admin') < 0) $state.go('root');

		// Add plugins into datatable
		self.dtOptions = {
			dom: 'Tlfrtip',
			tableTools: {
				sSwfPath: '/lib/datatables-tabletools/swf/copy_csv_xls.swf',
				aButtons: ['copy', 'xls']
			}
		};

		// Find a list of volunteers
		self.find = function() {
			self.volunteers = VolunteerAdmin.query();
		};

		// Find existing volunteer
		self.findOne = function() {
			self.volunteer = VolunteerAdmin.get({
				volunteerId: $stateParams.volunteerId
			});
		};

		// Update existing volunteer
		self.update = function(updateType) {
			var volunteer = self.volunteer;

			if (updateType === 'Driver') {
				volunteer.driver = true;
			} else if (updateType === 'Inactive') {
				volunteer.status = updateType;
				volunteer.driver = false;
			} else {
				volunteer.status = updateType;
			}

			volunteer.$update(function() {
				// Redirect after save
				$state.go('root.listVolunteers');
			}, function(errorResponse) {
				self.error = errorResponse.data.message;
			});
		};
		
		// Delete volunteer
		self.delete = function(volunteer) {
			if ($window.confirm('Are you sure?')) {
				volunteer.$delete(function() {
					$state.go('root.listVolunteers', null, { reload: true });
				}, function(errorResponse) {
					self.error = errorResponse.data.message;
				});	
			}
		};
	}
})();

(function() {
	'use strict';

	VolunteerUserController.$inject = ["$stateParams", "$state", "Authentication", "VolunteerUser", "moment"];
	angular.module('volunteer').controller('VolunteerUserController', VolunteerUserController);

	/* @ngInject */
	function VolunteerUserController($stateParams, $state, Authentication, VolunteerUser, moment) {
		var self = this,
				user = Authentication.user;
		// This provides Authentication context
		self.authentication = Authentication;

		// If user is not signed in redirect to signin
		if(!user) $state.go('root.signin');

		// Redirect to edit if user has already applied
		if (user && user.hasApplied && $state.is('root.createVolunteerUser')) $state.go('root.editVolunteerUser', { volunteerId: user._id });

		// Populate volunteer object if the user has filled an application
		self.volunteer = Authentication.user;

		// Helper method to determine the volunteer's age
		self.isMinor = function(dateOfBirth) {
			return moment().diff(dateOfBirth, 'years') < 18;
		};

		// Create a new volunteer
		self.create = function() {
			var volunteer = new VolunteerUser(self.volunteer);
			delete volunteer._id;
			self.volunteer.hasApplied = true;

			volunteer.$save(function(response) {
				// Redirect after save
				$state.go('root.createVolunteerUser-success', null, { reload: true });
			}, function(errorResponse) {
				self.error = errorResponse.data.message;
			});
		};

		// Find existing volunteer
		self.findOne = function() {
			self.volunteer = VolunteerUser.get({
				volunteerId: $stateParams.volunteerId
			});
		};

		// Update existing volunteer
		self.update = function() {
			var volunteer = self.volunteer;

			volunteer.$update(function() {
				// Redirect after update
				$state.go('root');
			}, function(errorResponse) {
				self.error = errorResponse.data.message;
			});
		};
	}
})();

'use strict';

// Volunteer service used for communicating with the volunteer REST endpoints
angular.module('volunteer').factory('VolunteerUser', ['$resource',
	function($resource) {
		return $resource('volunteer/:volunteerId', {
			volunteerId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]).factory('VolunteerAdmin', ['$resource',
	function($resource) {
		return $resource('admin/volunteers/:volunteerId', {
			volunteerId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
