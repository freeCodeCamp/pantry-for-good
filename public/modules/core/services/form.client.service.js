'use strict';

angular.module('core').factory('Form', Form);

/* @ngInject */
function Form() {
	var methods = {
		generate: generate,
		handleCheckbox: handleCheckbox,
		isChecked: isChecked,
		selectAllFoods: selectAllFoods,
		foodIsChecked: foodIsChecked,
		toggleFoodSelection: toggleFoodSelection,
	};

	return { methods: methods };

	// Factory Implementation

	// Dynamically generate a form based on the questionnaire sections and fields
	// created in the questionnaire editor, and the list of foods in the db
	function generate(formObject, formInit, qIdentifier) {
		var relevantSections = _.sortBy(_.filter(formInit.sections, function(obj) {
			return (obj.questionnaire.identifier === qIdentifier);
		}), 'position');
		var maxColumns = 4, dynForm = [];

			// Loop through sections for given questionnaire
			for (var iSect = 0; iSect < relevantSections.length; iSect++) {
				var dynSection = [];
				var fieldsInSection = _.filter(formInit.fields, { section: relevantSections[iSect] });
				var rowMaxInSection = _.maxBy(fieldsInSection, 'row') ? _.maxBy(fieldsInSection, 'row').row : 0;

				// Loop through rows for given section
				for (var iRow = 0; iRow < rowMaxInSection; iRow++) {
					var firstCell = _.find(fieldsInSection, { row: iRow + 1, column: 1 });

					// If the field at column 1 is a table, insert table row into dynamic form
					if (firstCell && firstCell.type === 'Table') {
						dynSection.push(generateTableRow(formObject, firstCell.label, firstCell.name));
					} else {

					// Otherwise, if the field at column 1 is not a table, insert standard row into dynamic form
						dynSection.push(generateStandardRow(iRow, fieldsInSection, maxColumns));
					}
				} // Next row
				dynForm.push(dynSection);
			} // Next section
			return {
				dynForm: dynForm,
				sectionNames: _.map(_.sortBy(_.filter(formInit.sections, {'questionnaire': { 'identifier': qIdentifier }}), 'position'), 'name'),
				foodList: _.flatMap(formInit.foods, function(category) {return category.items; })
			};
	} // Function generate

	// Helper function: generate table
	function generateTableRow(formObject, tableDescription, tableName) {
		var parsedTableDescription = {
			rows: /(ROWS:\s*)(.*)(COLUMNS)/.exec(tableDescription)[2].split(/;\s*/),
			cols: /(COLUMNS:\s*)(.*)/.exec(tableDescription)[2].split(/;\s*/),
		};
		parsedTableDescription.columnNames = parsedTableDescription.cols.slice(1, 99);

		// Initialize table array to be used for initialization
		var tmpTable = [];

		// Go through each table row and initialize keys that don't exist yet
		for (var iTableRow = 0; iTableRow < parsedTableDescription.rows.length; iTableRow++) {
			// Create row object with name from description
			tmpTable.push({ name: parsedTableDescription.rows[iTableRow] });

			// Initialize values in table row that don't exist yet
			for (var iCell = 0; iCell < parsedTableDescription.columnNames.length; iCell++) {
				var iTableColumn = parsedTableDescription.columnNames[iCell];

				// Take value from table on form object, if they exist
				try {
					tmpTable[iTableRow][iTableColumn] = formObject[tableName][iTableRow][iTableColumn] || 0;
				} catch (e) {
					tmpTable[iTableRow][iTableColumn] = 0;
				}

			} // next value
		} // next table row

		formObject[tableName] = tmpTable;
		return { tableHeaders: parsedTableDescription.cols, tableName: tableName };
	}

	// Helper function: generate standard row
	function generateStandardRow(iRow, fieldsInSection, maxColumns) {
		var cSkip = 0, standardRow = [];
		var emptyCell = { status: 'empty' }, skipCell = { status: 'skip' };

		// Loop through cells for given row
		for (var iColumn = 0; iColumn < maxColumns; iColumn++) {

			// If previous cell spans over current, skip
			if (cSkip > 0) {
				standardRow.push(skipCell);
				cSkip--;

			// Otherwise find field for given row and column
			} else {
				var field = _.find(fieldsInSection, { row: iRow + 1, column: iColumn + 1 });

				// If the field exists, insert it into row, otherwise insert empty placeholder cell into row
				standardRow.push(field ? field : emptyCell);
				cSkip = field ? field.span - 1 : 0;
			}
		} // Next column
		return standardRow;
	} // Helper function generate standard row

	
	function isChecked(obj, name, element) {
		return (typeof(obj[name]) === 'object' && obj[name].indexOf(element) > -1);
	}

	function handleCheckbox(obj, name, element) {
		// Initialise as array if undefined
		if (typeof obj[name] !== 'object') {
			obj[name] = [element];
			return;
		}

		// If element is not yet in array, push it, otherwise delete it from array
		var i = obj[name].indexOf(element);
		if (i === -1) {
			obj[name].push(element);
		} else {
			obj[name].splice(i, 1);
		}
	} // Function handleCheckbox

	function selectAllFoods(formObject, checked) {
	// Toggle selection of all food items
		if (!checked) {
			formObject.foodPreferences = [];
			formObject.foodList.forEach(function(item) {
				formObject.foodPreferences.push(item._id);
			});
		} else {
			formObject.foodPreferences = [];
		}
	}

	// Check if food item is selected
	function foodIsChecked(formObject, selectedFood) {
		if (formObject.foodPreferences) {
			return formObject.foodPreferences.indexOf(selectedFood._id) > -1;
		}
	}

	// Store food category when box is checked an remove when unchecked
	function toggleFoodSelection(formObject, selectedFood) {
		// Initialise as array if undefined
		if (typeof formObject.foodPreferences !== 'object') {
			formObject.foodPreferences = [selectedFood._id];
			return;
		}

		var index = formObject.foodPreferences.indexOf(selectedFood._id);
		if (index > -1) {
			formObject.foodPreferences.splice(index, 1);
		} else {
			formObject.foodPreferences.push(selectedFood._id);
		}
	}

} // Factory Form
