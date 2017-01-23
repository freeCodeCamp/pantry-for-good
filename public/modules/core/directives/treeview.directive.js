import angular from 'angular';

angular.module('core').directive('treeview', treeview);

/* @ngInject */
function treeview() {
	angular.element.fn.tree = function() {
		return angular.element(this).each(function() {
			var btn = angular.element(this).children('a').first();
			var menu = angular.element(this).children('.treeview-menu').first();
			var isActive = angular.element(this).hasClass('active');

			// Initialize already active menus
			if (isActive) {
				menu.show();
				btn.children('.fa-angle-left').first().removeClass('fa-angle-left').addClass('fa-angle-down');
			}

			// Slide open or close the menu on link click
			btn.click(function(e) {
				e.preventDefault();
				if (isActive) {
					// Slide up to close menu
					isActive = false;
					btn.children('.fa-angle-down').first().removeClass('fa-angle-down').addClass('fa-angle-left');
					btn.parent('li').addClass('active');
				} else {
					// Slide down to open menu
					isActive = true;
					btn.children('.fa-angle-left').first().removeClass('fa-angle-left').addClass('fa-angle-down');
					btn.parent('li').removeClass('active');
				}
			});

			// Add margins to submenu elements to give it a tree look
			menu.find('li > a').each(function() {
				var pad = parseInt(angular.element(this).css('margin-left')) + 10;

				angular.element(this).css({
					'margin-left': pad + 'px'
				});
			});
		});
	};

	return {
		restrict: 'C',
		link: function(scope, element) {
			scope.$on('repeatLastDone', function() {
				angular.element(element).tree();
			});
		}
	};
}
