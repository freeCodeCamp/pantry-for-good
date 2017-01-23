import customerAdminTemplate from '../views/admin/list-customers.client.view.html';
import viewCustomerTemplate from '../views/view-customer.client.view.html';
import editCustomerTemplate from '../views/edit-customer.client.view.html';
import householdTemplate from '../views/partials/household.partial.html';
import waiverTemplate from '../views/partials/waiver.partial.html';
import dynamicViewTemplate from '../../core/views/partials/dynamic-view.partial.html';
import dynamicFormTemplate from '../../core/views/partials/dynamic-form.partial.html';

// Setting up route
angular.module('customer').config(//['$stateProvider', 'AuthenticationProvider',
	function($stateProvider, AuthenticationProvider){
		// Customer state routing for admin
		$stateProvider.
		state('root.listCustomers', {
			url: 'admin/customers',
			views: {
				'content@': {
					template: customerAdminTemplate,
					controller: 'CustomerAdminController as dynCtrl'
				}
			},
			resolve: {
				CurrentUser: AuthenticationProvider.requireAdminUser
			}
		}).
		state('root.viewCustomerAdmin', {
			url: 'admin/customers/:customerId',
			views: {
				'content@': {
					template: viewCustomerTemplate,
					controller: 'CustomerAdminController as dynCtrl'
				},
				'dynamic-view@root.viewCustomerAdmin': {
					template: dynamicViewTemplate
				}
			},
			resolve: {
				CurrentUser: AuthenticationProvider.requireAdminUser
			}
		}).
		state('root.editCustomerAdmin', {
			url: 'admin/customers/:customerId/edit',
			views: {
				'content@': {
					template: editCustomerTemplate,
					controller: 'CustomerAdminController as dynCtrl'
				},
				'dynamic-form@root.editCustomerAdmin': {
					template: dynamicFormTemplate
				},
				'household@root.editCustomerAdmin': {
					template: householdTemplate
				}
			},
			resolve: {
				CurrentUser: AuthenticationProvider.requireAdminUser
			}
		});
	}
//]
);
