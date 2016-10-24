'use strict';
// Get template configuration from file
var appconfig = require('../../app-config.json');

module.exports = {
	app: {
		title: appconfig.title,
		description: appconfig.description,
		keywords: appconfig.keywords,
		appconfig: appconfig
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	mailer: {
		from: {
			first: process.env.MAILER_FROM_FIRST || 'MAILER_FROM_FIRST',
			second: process.env.MAILER_FROM_SECOND || 'MAILER_FROM_SECOND'
		},
		to: process.env.MAILER_FROM_FIRST || 'MAILER_TO',
		options: {
			service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
			auth: {
				user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
				pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
			}
		}
	},
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.css',
				'public/lib/fontawesome/css/font-awesome.css',
				'public/lib/admin-lte/dist/css/AdminLTE.css',
				'public/lib/admin-lte/dist/css/skins/skin-blue.css',
				'public/lib/admin-lte/plugins/datatables/dataTables.bootstrap.css',
				'public/lib/datatables-colvis/css/dataTables.colVis.css',
				'public/lib/datatables-colreorder/css/dataTables.colReorder.css',
				'public/lib/datatables-tabletools/css/dataTables.tableTools.css',
				'public/lib/angular-print/angularPrint.css'
			],
			js: [
				'public/lib/jquery/dist/jquery.js',
				'public/lib/datatables/media/js/jquery.dataTables.js',
				'public/lib/admin-lte/plugins/datatables/dataTables.bootstrap.js',
				'public/lib/angular/angular.js',
				'public/lib/angular-resource/angular-resource.js',
				'public/lib/angular-cookies/angular-cookies.js',
				'public/lib/angular-animate/angular-animate.js',
				'public/lib/angular-touch/angular-touch.js',
				'public/lib/angular-sanitize/angular-sanitize.js',
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
				'public/lib/bootstrap/dist/js/bootstrap.js',
				'public/lib/admin-lte/dist/js/app.js',
				'public/lib/admin-lte/plugins/slimScroll/jquery.slimscroll.js',
				'public/lib/angular-datatables/dist/angular-datatables.js',
				'public/lib/datatables-colvis/js/dataTables.colVis.js',
				'public/lib/angular-datatables/dist/plugins/colvis/angular-datatables.colvis.js',
				'public/lib/datatables-colreorder/js/dataTables.colReorder.js',
				'public/lib/datatables-tabletools/js/dataTables.tableTools.js',
				'public/lib/angular-datatables/dist/plugins/colreorder/angular-datatables.colreorder.js',
				'public/lib/angular-print/angularPrint.js',
				'public/lib/angular-smart-table/dist/smart-table.js',
				'public/lib/moment/moment.js',
				'public/lib/angular-moment/angular-moment.js',
				'public/lib/moment-recur/moment-recur.js',
				'public/lib/lodash/dist/lodash.js',
				'public/lib/angular-google-maps/dist/angular-google-maps.js',
				'public/lib/angular-file-upload/dist/angular-file-upload.js'
			]
		},
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};
