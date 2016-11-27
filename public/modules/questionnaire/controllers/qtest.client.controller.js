/* globals _ */

(function() {
	'use strict';

	angular.module('questionnaire').controller('qTestController', qTestController);

	/* @ngInject */
	function qTestController(Questionnaire, Section, Field, $scope) {

		$scope.generateForm = function(qId) {
			var cRows = _.maxBy($scope.fields, 'row').row, cCols = 4;
			var r, cVoid = 0;
			var invalidCell = { status: 'invalid' };
			var voidCell = { status: 'valid', span: 0 };

			var dynamicForm = [];
			// Using Client Questionnaire only for testing
			$scope.filteredSections = _.sortBy(_.filter($scope.sections, {'questionnaire': { '_id': qId }}), 'position');

			for (var s = 0; s < $scope.filteredSections.length; s++) {
				var tmpRow = [];
				for (var i = 0; i < cRows; i++) {
					var tmpArr = [];
					for (var j = 0; j < cCols; j++) {
						if (cVoid > 0) {
							tmpArr.push(voidCell);
							cVoid--;
						} else {
							r = _.find($scope.fields, {
								'row': i + 1,
								'column': j + 1,
								'section': $scope.filteredSections[s]
							});

							if (r === undefined) {
								tmpArr.push(invalidCell);
							} else {
								r.status = 'valid';
								tmpArr.push(r);
								cVoid = r.span - 1;
							} // if r is undefined
						} // if void cells left

					} // for j, cells
					tmpRow.push(tmpArr);
				} // for i, rows
				dynamicForm.push(tmpRow);
			} // for s, sections

			$scope.dynForm = dynamicForm;
		}; // Function generate Form

		$scope.handleSelection = function () {
			$scope.form = {}; // Object to put input field on
			$scope.generateForm($scope.selectedQuestionnaire);
		};

		// Load all questionnaires
		Questionnaire.query({}, function (questionnaires) {
			$scope.questionnaires = questionnaires;
		});

		// Load all sections
		Section.query({}, function (sections) {
			$scope.sections = sections;
		});

		// Load all fields
		Field.query({}, function (fields) {
			$scope.fields = fields;
		});

	}
})();
