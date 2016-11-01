'use strict';

// Configuring the Question module
angular.module('question').run(['Menus',
	function(Menus) {
		// Set sidebar menu items for admin
		Menus.addMenuItem('admin', 'Questionnaire Editor', 'admin/questions', 'item', 'root.questions', '', ['admin'], 10);
	}
]);
