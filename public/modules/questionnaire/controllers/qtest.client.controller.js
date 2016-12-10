(function() {
	'use strict';

	angular.module('questionnaire').controller('qTestController', qTestController);

	/* @ngInject */
	function qTestController(Questionnaire, Section, Field, $scope, $q) {

		$scope.handleCheckboxClick = function (name, element) {

			// Initialise as array if undefined
			if (typeof $scope.form[name] !== 'object') {
				$scope.form[name] = [element];
				return;
			}

			// If element is not yet in array, push it, otherwise delete it from array
			var i = $scope.form[name].indexOf(element);
			if (i === -1) {
				$scope.form[name].push(element);
			} else {
				$scope.form[name].splice(i, 1);
			}
		};

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

		var promiseHash = {};
    promiseHash.questionnaires = Questionnaire.query().$promise;
    promiseHash.sections = Section.query().$promise;
    promiseHash.fields = Field.query().$promise;

    $q.all(promiseHash)
			.then(function(results) {
				$scope.questionnaires = results.questionnaires;
				$scope.sections = results.sections;
				$scope.fields = results.fields;

				// Default: Client Questionnaire selected
				$scope.selectedQuestionnaire = '581da83d367d0b1eef2e8d9e';
				$scope.handleSelection();

		});
	}
})();
