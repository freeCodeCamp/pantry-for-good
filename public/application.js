import 'jquery';
import 'bootstrap';
import angular from 'angular';
import 'admin-lte';
import 'admin-lte/plugins/slimScroll/jquery.slimscroll'
import thunk from 'redux-thunk';
import ApplicationConfiguration from './config';
import * as modules from './modules';
import rootReducer from './store';
import api from './middleware/api';
import {setUser} from './store/auth';

import 'bootstrap/dist/css/bootstrap.min.css'
import 'font-awesome/css/font-awesome.css';
import 'admin-lte/dist/css/AdminLTE.min.css';
import 'admin-lte/dist/css/skins/skin-blue.min.css';

import './application.min.css';
import './modules/core/css/core.css';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, [
	...ApplicationConfiguration.applicationModuleVendorDependencies,
	modules.common,
	modules.core,
	modules.users,
	modules.customer,
	modules.donor,
	modules.driver,
	modules.food,
	modules.media,
	modules.packing,
	modules.questionnaire,
	modules.schedule,
	modules.settings,
	modules.volunteer
]);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider', '$ngReduxProvider',
	function($locationProvider, $ngReduxProvider) {
		$locationProvider.hashPrefix('!');
		$ngReduxProvider.createStoreWith(
			rootReducer,
			['ngUiRouterMiddleware',thunk, api],
			__DEVELOPMENT__ ? [
				window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : () => {}
			] : null
		);
	}]);

// if (process.env.NODE_ENV !== 'test') {
// 	angular.module(ApplicationConfiguration.applicationModuleName)
// 		.run(($ngRedux, $rootScope, $timeout) => {
// 			// To reflect state changes when disabling/enabling actions via the monitor
// 			// there is probably a smarter way to achieve that
// 			$ngRedux.subscribe(() => {
// 					$timeout(() => {$rootScope.$apply(() => {})}, 100);
// 			});
// 		});
// }

// not getting user object passed from server now, need to get it before starting app
$.ajax({
	url: 'api/users/me'
}).then(function(user) {
	global.user = user;

	console.log('user', user)
	//Then define the init function for starting up the application
	angular.element(document).ready(function() {
		//Fixing facebook bug with redirect
		if (window.location.hash === '#_=_') window.location.hash = '#!';

		// set user in store
		angular.module(ApplicationConfiguration.applicationModuleName)
			.run($ngRedux => $ngRedux.dispatch(setUser(user)));

		//Then init the app
		angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
	});

});
