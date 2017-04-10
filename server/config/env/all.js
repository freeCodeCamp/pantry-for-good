'use strict'

module.exports = {
  port: process.env.PORT || 3000,
  templateEngine: 'nunjucks',
  sessionSecret: 'MEAN',
  sessionCollection: 'sessions',
  mailer: {
    from: process.env.MAILER_FROM || 'MAILER_FROM',
    to: process.env.MAILER_TO || 'MAILER_TO',
    sendgridKey: process.env.SENDGRID_API_KEY || 'SEND_GRID_API_KEY'
  },
  googleMaps: {
    key: process.env.GOOGLE_MAPS_API_KEY || 'API_KEY'
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
      'public/testInitialization.js',
      'public/modules/customer/tests/admin-customer.client.controller.test.js',
      'public/modules/*/tests/*.js'
    ]
  }
}
