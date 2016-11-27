'use strict';

module.exports = {
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
				'public/lib/bootstrap/dist/css/bootstrap.min.css',
				'public/lib/font-awesome/css/font-awesome.min.css',
				'public/lib/AdminLTE/dist/css/AdminLTE.min.css',
				'public/lib/AdminLTE/dist/css/skins/skin-blue.min.css',
				'public/lib/AdminLTE/plugins/datatables/dataTables.bootstrap.css',
				'public/lib/datatables-tabletools/css/dataTables.tableTools.css',
				'public/lib/angular-print/angularPrint.css'
			],
			js: [
				'public/lib/jquery/dist/jquery.min.js',
				'public/lib/datatables/media/js/jquery.dataTables.min.js',
				'public/lib/AdminLTE/plugins/datatables/dataTables.bootstrap.js',
				'public/lib/angular/angular.min.js',
				'public/lib/angular-resource/angular-resource.js',
				'public/lib/angular-ui-router/release/angular-ui-router.min.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
				'public/lib/bootstrap/dist/js/bootstrap.min.js',
				'public/lib/AdminLTE/dist/js/app.min.js',
				'public/lib/AdminLTE/plugins/slimScroll/jquery.slimscroll.min.js',
				'public/lib/angular-datatables/dist/angular-datatables.min.js',
				'public/lib/datatables-tabletools/js/dataTables.tableTools.js',
				'public/lib/angular-print/angularPrint.js',
				'public/lib/angular-smart-table/dist/smart-table.min.js',
				'public/lib/moment/moment.js',
				'public/lib/angular-moment/angular-moment.min.js',
				'public/lib/moment-recur/moment-recur.min.js',
				'public/lib/lodash/dist/lodash.min.js',
				'public/lib/angular-simple-logger/dist/angular-simple-logger.min.js',
				'public/lib/angular-google-maps/dist/angular-google-maps.min.js',
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
