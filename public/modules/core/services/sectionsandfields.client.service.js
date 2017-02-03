'use strict';

angular.module('core').factory('SectionsAndFields', SectionsAndFields);

/* @ngInject */
function SectionsAndFields(Section, Field, $q) {
		var service = {
			get: get
		};
		return service;

		function get() {
			var promiseHash = {};
			promiseHash.sections = Section.query().$promise;
			promiseHash.fields = Field.query().$promise;

			return $q.all(promiseHash);
		}

} // Factory GetSectionsAndFields
