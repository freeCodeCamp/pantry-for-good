import angular from 'angular';

export default angular.module('common')
  .factory('Media', ['$resource',
    function($resource) {
      return $resource('api/media/');
    }
  ])
  .name;
