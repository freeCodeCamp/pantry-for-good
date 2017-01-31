(function() { 'use strict';
	angular.module('questionnaire').controller('qTestController', qTestController);

	/* @ngInject */
	function qTestController() {
		/*jshint validthis: true */
		var self = this;

		var mock1 = "ROWS: Employment Income; Employment Insurance Benefits; Social Assistance; Spousal/Child Support; Self Employment; Pension Income (eg. Employer Plan); Disability Income; Workplace Safety and Insurance Board (WSIB) Benefits; Pension Plan; Child Tax Benefits; Income from Rental Property; Severance/Termination Pay; Any other source of income not listed above COLUMNS: PART 1 - MONTHLY GROSS INCOME; Self; Other";

		var mock2 = "ROWS: Rent, mortgage or room and board; Food; Utilities (phone, internet, water, heat/hydro); Transportation, parking and other personal supports; Dependant Care (eg. day care); Disability Needs; Spousal/Child support; Loans; Leases; Insurance; Credit card debt; Property taxes; Other costs not listed above COLUMNS: MONTHLY LIVING EXPENSES; Household";

		var mock3 = "ROWS: Employment Income, Employment Insurance Benefits, Pension Plan, Child Tax Benefits, Income from Rental Property, Severance/Termination Pay COLUMNS: PART 1 - MONTHLY GROSS INCOME; Self; Other; YetAnother";

		var mock = mock2;

		self.mockRows = /(ROWS:\s*)(.*)(COLUMNS)/.exec(mock)[2].split(/;\s*/);
		self.mockCols = /(COLUMNS:\s*)(.*)/.exec(mock)[2].split(/;\s*/);
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
