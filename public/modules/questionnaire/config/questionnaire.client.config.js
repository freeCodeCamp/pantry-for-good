'use strict';

// Configuring the Questionnaire module
angular.module('questionnaire').run(['Menus',
	function(Menus) {
		// Set sidebar menu items for admin
		Menus.addMenuItem('admin', 'Questionnaire Editor', 'admin/questionnaires', 'item', 'root.questionnaires', '', ['admin'], 10);
	}
]);
