'use strict';

// Configuring the Media module
angular.module('media').run(['Menus',
	function(Menus) {
		Menus.addMenuItem('admin', 'Media', 'media', 'item', 'root.changeMedia', '', ['admin'], 8);
	}
]);
