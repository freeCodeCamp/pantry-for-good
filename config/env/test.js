'use strict';
// Get template configuration from file
var tconfig = require('../../template-config.json');

module.exports = {
	db: 'mongodb://localhost' + tconfig.mongodb_test,
	port: 3001,
	app: {
		title: tconfig.organization + ' - Test Environment'
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
	}
};

console.log('TEMPLATE CONFIG: DB: ', module.exports.db);
