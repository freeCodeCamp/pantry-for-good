'use strict';
// Get template configuration from file
var appconfig = require('../../app-config.json');

module.exports = {
	db: process.env.MONGO_DEV_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/fb-dev',
	app: {
		title: 'Development Environment',
		appconfig: appconfig
	}
};

console.log('APP CONFIG: DB: ', module.exports.db);
