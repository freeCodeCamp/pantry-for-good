import createCustomerTemplate from '../views/user/create-customer.client.view.html';
import createCustomerSuccessTemplate from '../views/user/create-customer-success.client.view.html';
import viewCustomerTemplate from '../views/view-customer.client.view.html';
import editCustomerTemplate from '../views/edit-customer.client.view.html';
import householdTemplate from '../views/partials/household.partial.html';
import waiverTemplate from '../views/partials/waiver.partial.html';
import dynamicFormTemplate from '../../core/views/partials/dynamic-form.partial.html';
import dynamicViewTemplate from '../../core/views/partials/dynamic-view.partial.html';

// Setting up route
angular.module('customer').config(//['$stateProvider', 'AuthenticationProvider',
	function($stateProvider, AuthenticationProvider){
		// Customer state routing for user
		$stateProvider.
		state('root.createCustomerUser', {
			url: 'customer/create',
			views: {
				'content@': {
					template: createCustomerTemplate,
					controller: 'CustomerUserController as dynCtrl'
				},
				'dynamic-form@root.createCustomerUser': {
					template: dynamicFormTemplate
				},
				'household@root.createCustomerUser': {
					template: householdTemplate
				},
				'waiver@root.createCustomerUser': {
					template: waiverTemplate
				}
			},
			resolve: {
				CurrentUser: AuthenticationProvider.requireLoggedIn
			}
		}).
		state('root.createCustomerUser-success', {
			url: 'customer/create/success',
			views: {
				'content@': {
					template: createCustomerSuccessTemplate
				}
			},
			resolve: {
				CurrentUser: AuthenticationProvider.requireLoggedIn
			}
		}).
		state('root.viewCustomerUser', {
			url: 'customer/:customerId',
			views: {
				'content@': {
					template: viewCustomerTemplate,
					controller: 'CustomerUserController as dynCtrl'
				},
				'dynamic-view@root.viewCustomerUser': {
					template: dynamicViewTemplate
				}
			},
			resolve: {
				CurrentUser: AuthenticationProvider.requireLoggedIn
			}
		}).
		state('root.editCustomerUser', {
			url: 'customer/:customerId/edit',
			views: {
				'content@': {
					template: editCustomerTemplate,
					controller: 'CustomerUserController as dynCtrl'
				},
				'dynamic-form@root.editCustomerUser': {
					template: dynamicFormTemplate
				},
				'household@root.editCustomerUser': {
					template: householdTemplate
				}
			},
			resolve: {
				CurrentUser: AuthenticationProvider.requireLoggedIn
			}
		});
	}
//]
);
