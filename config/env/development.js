'use strict';
// Get template configuration from file
var appconfig = require('../../app-config.json');

module.exports = {
	db: appconfig.mongodb_dev,
	app: {
		title: 'Development Environment',
		appconfig: appconfig
	}
};

console.log('APP CONFIG: DB: ', module.exports.db);
