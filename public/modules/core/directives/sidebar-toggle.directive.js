'use strict';

// Add push menu functionality to the sidebar
angular.module('core').directive('sidebarToggle', function() {
	return {
		restrict: 'C',
		compile: function (element, attr) {
			if (attr.toggle === 'offcanvas') {
				element.click(function (e) {
					e.preventDefault();

					// If window is large enough, enable sidebar push menu
					if (angular.element(window).width() >= 768) {
						angular.element('body').toggleClass('sidebar-collapse');
					}
					// Handle sidebar push menu for small screens
					else {
						if (angular.element('body').hasClass('sidebar-open')) {
							angular.element('body').removeClass('sidebar-open');
							angular.element('body').removeClass('sidebar-collapse');
						} else {
							angular.element('body').addClass('sidebar-open');
						}
					}
				});
			}
		}
	};
});
