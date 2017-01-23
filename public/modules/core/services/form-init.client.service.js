import angular from 'angular';

export default angular.module('core').factory('formInit', formInit).name;

/* @ngInject */
function formInit(Section, Field, FoodUser, $q) {
		var service = {
			get: get
		};
		return service;

		function get() {
			var promiseHash = {};
			promiseHash.sections = Section.query().$promise;
			promiseHash.fields = Field.query().$promise;
			promiseHash.foods = FoodUser.query().$promise;

			return $q.all(promiseHash);
		}

} // Factory GetformInit
