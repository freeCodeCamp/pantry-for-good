'use strict';

angular.module('core').factory('View', View);

/* @ngInject */
function View() {
	var service = {
		generate: generate,
		getSectionNames: getSectionNames
	};
	return service;

	// Factory Implementation

	// Dynamically generates a questionnaire view based on the sections and fields
	// created in the questionnaire editor
	function generate(viewObject, sectionsAndFields, qIdentifier) {
		var relevantSections = _.sortBy(_.filter(sectionsAndFields.sections, function(obj) {
			// TODO: REMOVE LIMIT ON POSITION ONCE FIELDS FOR SECTIONS C AND E HAVE BEEN IMPLEMENTED
			return (obj.questionnaire.identifier === qIdentifier && obj.position < 10);
		}), 'position');
		var maxColumns = 6, dynView = [];

			// Loop through sections for given questionnaire
			for (var iSect = 0; iSect < relevantSections.length; iSect++) {
				var dynSection = [];
				var fieldsInSection = _.sortBy(_.filter(sectionsAndFields.fields, { section: relevantSections[iSect] }), ['row', 'column']);

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
						var content = fieldsInSection[iField].type === 'Date' ? new Date(viewObject[fieldsInSection[iField].name]).toDateString() : viewObject[fieldsInSection[iField].name];
						dynRow.push(fieldsInSection[iField].label + ':', content || '-');
						if (dynRow.length >= maxColumns) {
							dynSection.push(dynRow);
							dynRow = [];
						}
					} // if table
				
				} // Next field

				// Flush row if necessary
				if (dynRow.length > 0) dynSection.push(dynRow); 
				dynView.push(dynSection);

			} // Next section

			return dynView;
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


	function getSectionNames(sectionsAndFields, qIdentifier) {
		return _.map(_.sortBy(_.filter(sectionsAndFields.sections, {'questionnaire': { 'identifier': qIdentifier }}), 'position'), 'name');
	}


} // Factory View
