import angular from 'angular';
import footerTemplate from '../views/footer.client.view.html';
import headerTemplate from '../views/header.client.view.html';
import homeTemplate from '../views/home.client.view.html';
import sidebarTemplate from '../views/sidebar.client.view.html';
import unauthorizedTemplate from '../views/errors/403.client.view.html';
import notFoundTemplate from '../views/errors/404.client.view.html';
import errorTemplate from '../views/errors/500.client.view.html';

// Setting up routes
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Root state routing
		$stateProvider.
		state('root', {
			url: '/',
			views: {
				'header': {
					template: headerTemplate,
					controller: 'HeaderController as headerCtrl'
				},
				'sidebar': {
					template: sidebarTemplate,
					controller: 'SidebarController as sidebarCtrl'
				},
				'content': {
					template: homeTemplate,
					controller: 'HomeController as homeCtrl'
				},
				'footer': {
					template: footerTemplate
				}
			}
		}).

		// 403 Unauthorized
		state('root.403', {
			url: '403',
			views: {
				'content@': {
					template: unauthorizedTemplate
				}
			}
		}).
		// 404 Page not found
		state('root.404', {
			url: '404',
			views: {
				'content@': {
					template: notFoundTemplate
				}
			}
		}).
		// 500 Server error
		state('root.500', {
			url: '500',
			views: {
				'content@': {
					template: errorTemplate
				}
			}
		});

		// Redirect route from / to /signin
		$urlRouterProvider.when('', 'signin');

		// Redirect to 404 page view when route not found
		$urlRouterProvider.otherwise('404');
	}
]);
