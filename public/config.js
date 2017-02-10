import angular from 'angular';
import 'angular-resource';
import 'angular-file-upload';
import 'angular-simple-logger';
import 'angular-google-maps';
import 'angular-moment';
import 'angular-smart-table';
import 'angular-ui-bootstrap';
import 'angular-ui-router';
import './lib/angularPrint/angularPrint';
import 'angular-datatables';
import 'datatables.net';
import 'datatables.net-bs';
import 'datatables.net-buttons';
import 'datatables.net-buttons-bs';
import 'datatables.net-buttons/js/buttons.colVis';
import 'datatables.net-buttons/js/buttons.flash';
import 'datatables.net-buttons/js/buttons.html5';
import 'datatables.net-buttons/js/buttons.print';
import 'angular-datatables/dist/plugins/buttons/angular-datatables.buttons';
import ngRedux from 'ng-redux';
import ngReduxUiRouter from 'redux-ui-router';

// Init the application configuration module for AngularJS application
export default (function() {
	// Init module configuration options
	var applicationModuleName = 'foodbank-template';
	var applicationModuleVendorDependencies = ['ngResource',
	'ui.router', 'ui.bootstrap', 'ui.bootstrap.modal', 'datatables',
  'AngularPrint', 'smart-table', ngRedux, ngReduxUiRouter,
	'angularMoment', 'angularFileUpload'];

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
