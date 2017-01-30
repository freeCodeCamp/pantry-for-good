import angular from 'angular';

export default angular.module('common').factory('Tconfig', ['$resource',
	function($resource) {
    return $resource('api/settings/');
  }
])
  .name;
