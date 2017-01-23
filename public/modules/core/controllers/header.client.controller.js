import angular from 'angular';

angular.module('core').controller('HeaderController', HeaderController);

/* @ngInject */
function HeaderController(Authentication) {
	var self = this;

	self.authentication = Authentication;
}
