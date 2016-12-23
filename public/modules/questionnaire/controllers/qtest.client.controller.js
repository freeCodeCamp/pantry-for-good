(function() { 'use strict';
	angular.module('questionnaire').controller('qTestController', qTestController);

	/* @ngInject */
	function qTestController() {
		/*jshint validthis: true */
		var self = this;

		var mock = "Rows: Employment Income, Employment Insurance Benefits, Social Assistance, Spousal/Child Support, Self Employment, Pension Income (eg. Employer Plan), Disability Income, Workplace Safety and Insurance Board (WSIB) Benefits, Pension Plan, Child Tax Benefits, Income from Rental Property, Severance/Termination Pay, Any other source of income not listed above Columns: PART 1 - MONTHLY GROSS INCOME, Self, Other";

		self.mockRows = /(Rows:\s*)(.*)(Columns)/.exec(mock)[2].split(/,\s*/);
		self.mockCols = /(Columns:\s*)(.*)/.exec(mock)[2].split(/,\s*/);
		self.inputFields = self.mockCols.slice(1, 99);

		self.income = [];
		self.mockRows.forEach(function (item) {
			var cell = { name: item };
			for (var i = 0; i < self.inputFields.length; i++) {
				cell[self.inputFields[i]] = 0;
			}
			self.income.push(cell);
		});

	}
})();
