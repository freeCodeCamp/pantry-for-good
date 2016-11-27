'use strict';

module.exports = {
	port: 443,
	db: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://localhost:27017/fb-prod',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.min.css',
				'public/lib/fontawesome/css/font-awesome.min.css',
				'public/lib/admin-lte/dist/css/AdminLTE.min.css',
				'public/lib/admin-lte/dist/css/skins/skin-blue.min.css',
				'public/lib/admin-lte/plugins/datatables/dataTables.bootstrap.css',
				'public/lib/datatables-colvis/css/dataTables.colVis.css',
				'public/lib/datatables-colreorder/css/dataTables.colReorder.css',
				'public/lib/datatables-tabletools/css/dataTables.tableTools.css',
				'public/lib/angular-print/angularPrint.css'
			],
			js: [
				'public/lib/jquery/dist/jquery.min.js',
				'public/lib/datatables/media/js/jquery.dataTables.min.js',
				'public/lib/admin-lte/plugins/datatables/dataTables.bootstrap.js',
				'public/lib/angular/angular.min.js',
				'public/lib/angular-resource/angular-resource.min.js',
				'public/lib/angular-animate/angular-animate.min.js',
				'public/lib/angular-ui-router/release/angular-ui-router.min.js',
				'public/lib/angular-ui-utils/ui-utils.min.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
				'public/lib/jquery/dist/jquery.min.js',
				'public/lib/bootstrap/dist/js/bootstrap.min.js',
				'public/lib/admin-lte/dist/js/app.min.js',
				'public/lib/admin-lte/plugins/slimScroll/jquery.slimscroll.min.js',
				'public/lib/angular-datatables/dist/angular-datatables.min.js',
				'public/lib/datatables-colvis/js/dataTables.colVis.js',
				'public/lib/angular-datatables/dist/plugins/colvis/angular-datatables.colvis.min.js',
				'public/lib/datatables-colreorder/js/dataTables.colReorder.js',
				'public/lib/datatables-tabletools/js/dataTables.tableTools.js',
				'public/lib/angular-datatables/dist/plugins/colreorder/angular-datatables.colreorder.min.js',
				'public/lib/angular-print/angularPrint.js',
				'public/lib/angular-smart-table/dist/smart-table.min.js',
				'public/lib/moment/moment.js',
				'public/lib/angular-moment/angular-moment.min.js',
				'public/lib/moment-recur/moment-recur.min.js',
				'public/lib/lodash/dist/lodash.min.js',
				'public/lib/angular-google-maps/dist/angular-google-maps.min.js'
			]
		},
		css: 'public/dist/application.min.css',
		js: 'public/dist/application.min.js'
	},
	mailer: {
		from: process.env.MAILER_FROM || 'MAILER_FROM',
		options: {
			service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
			auth: {
				user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
				pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
			}
		}
	},
	googleMaps: {
		key: process.env.GOOGLE_MAPS || 'API_KEY'
	}
};
