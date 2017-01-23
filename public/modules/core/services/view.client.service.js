import angular from 'angular';

export default angular.module('core').factory('View', View);

/* @ngInject */
function View() {
	var methods = {
		generate: generate
	};
	return { methods: methods };

	// Factory Implementation

	// Dynamically generates a questionnaire view based on the sections and fields
	// created in the questionnaire editor
	function generate(viewObject, formInit, qIdentifier) {
		var relevantSections = _.sortBy(_.filter(formInit.sections, function(obj) {
			return (obj.questionnaire.identifier === qIdentifier);
		}), 'position');
		var foodList = _.flatMap(formInit.foods, function(category) {return category.items; });
		var maxColumns = 6, dynView = [];

			// Loop through sections for given questionnaire
			for (var iSect = 0; iSect < relevantSections.length; iSect++) {
				var dynSection = [];
				var fieldsInSection = _.sortBy(_.filter(formInit.fields, { section: relevantSections[iSect] }), ['row', 'column']);

				// Loop through all fields for given section, inserting rows as defined by maxColumns
				var dynRow = [];

				// Default: Mark row as not a header
				dynRow.header = false;

				for (var iField = 0; iField < fieldsInSection.length; iField++) {

					// If field is a table
					if (fieldsInSection[iField].type === 'Table') {
						// Flush current row if necessary
						if (dynRow.length) dynSection.push(dynRow);

						// Generate table and append to section (returned as an array)
						var dynTable = generateTableRow(viewObject, fieldsInSection[iField].label, fieldsInSection[iField].name);
						dynSection = _.concat(dynSection, dynTable);
					} else {

						// If field is not a table, insert standard row into section
						// Differentiate field types
						var content, fieldValue = viewObject[fieldsInSection[iField].name];
						switch (fieldsInSection[iField].type) {
							case 'Date':
								content = new Date(fieldValue).toDateString();
								break;
							case 'Checkboxes':
								content = fieldValue ? fieldValue.join(', ') : '';
								break;
							case 'Lookup':
								content = '';
								for (var i = 0; i < fieldValue.length; i++) {
									var foodItem = _.find(foodList, { _id: fieldValue[i] });
									if (foodItem) { content += foodItem.name + ', '; }
								}
								content = content.length > 1 ? content.substr(0, content.length - 2) : content;
								break;
							default:
								content = fieldValue;
								break;
						}
						dynRow.push(fieldsInSection[iField].label + ':', content || '-');
						if (dynRow.length >= maxColumns) {
							dynSection.push(dynRow);
							dynRow = [];
						}
					} // if table
				} // next field

				// Flush row if necessary
				if (dynRow.length > 0) dynSection.push(dynRow);
				dynView.push(dynSection);

			} // Next section

			return {
				dynForm: dynView,
				sectionNames: _.map(_.sortBy(_.filter(formInit.sections, {'questionnaire': { 'identifier': qIdentifier }}), 'position'), 'name'),
				foodList: foodList
			};

	} // Function generate

	// Helper function: generate table
	function generateTableRow(viewObject, tableDescription, tableName) {
			var rows = /(ROWS:\s*)(.*)(COLUMNS)/.exec(tableDescription)[2].split(/;\s*/),
					cols = /(COLUMNS:\s*)(.*)/.exec(tableDescription)[2].split(/;\s*/);

		var tmpTable = [cols];

		// Mark first table row as a header
		tmpTable[0].header = true;

		// Go through each table row and fill in cells
		for (var iRow = 0; iRow < rows.length; iRow++) {
			var tmpRow = [viewObject[tableName][iRow].name];
			// Mark regular rows as a not headers
			tmpRow.header = false;

			// Get values for columns after name column from view object
			for (var iCell = 1; iCell < cols.length; iCell++) {

				// Take value from table on view object, if it exists
				var value = (viewObject[tableName][iRow] && viewObject[tableName][iRow][cols[iCell]]) || 0;
				tmpRow.push('$' + value.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,"));
			} // next cells

			tmpTable.push(tmpRow);
		} // next table row

		return tmpTable;
	}

} // Factory View
