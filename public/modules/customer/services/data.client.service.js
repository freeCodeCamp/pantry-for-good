'use strict';

angular.module('customer').factory('Data', [function() {
	var incomeList = [
		{ name: 'Employment Income', self: 0, other: 0 },
		{ name: 'Employment Insurance Benefits', self: 0, other: 0 },
		{ name: 'Social Assistance', self: 0, other: 0 },
		{ name: 'Spousal/Child Support', self: 0, other: 0 },
		{ name: 'Self Employment', self: 0, other: 0 },
		{ name: 'Pension Income (eg. Employer Plan)', self: 0, other: 0 },
		{ name: 'Disability Income', self: 0, other: 0 },
		{ name: 'Workplace Safety and Insurance Board (WSIB) Benefits', self: 0, other: 0 },
		{ name: 'Canada Pension Plan (CPP)', self: 0, other: 0 },
		{ name: 'Child Tax Benefits', self: 0, other: 0 },
		{ name: 'Income from Rental Property', self: 0, other: 0 },
		{ name: 'Severance/Termination Pay', self: 0, other: 0 },
		{ name: 'Any other source of income not listed above', self: 0, other: 0 }
	];

	var expensesList = [
		{ name: 'Rent, mortgage or room and board', value: 0 },
		{ name: 'Food', value: 0 },
		{ name: 'Utilities (phone, internet, water, heat/hydro)', value: 0 },
		{ name: 'Transportation, parking and other personal supports', value: 0 },
		{ name: 'Dependant Care (eg. day care)', value: 0 },
		{ name: 'Disability Needs', value: 0 },
		{ name: 'Spousal/Child support', value: 0 },
		{ name: 'Loans', value: 0 },
		{ name: 'Leases', value: 0 },
		{ name: 'Insurance', value: 0 },
		{ name: 'Credit card debt', value: 0 },
		{ name: 'Property taxes', value: 0 },
		{ name: 'Other costs not listed above', value: 0 }
	];

	return {
		getIncomeList: function() {
			return incomeList;
		},
		getExpensesList: function() {
			return expensesList;
		}
	};
}]);