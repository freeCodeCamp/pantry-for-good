'use strict';
// Get template configuration from file
var tconfig = require('../../template-config.json');

module.exports = {
	db: tconfig.mongodb_dev,
	app: {
		title: tconfig.organization + ' - Development Environment',
		tconfig: tconfig
	}
};

console.log('TEMPLATE CONFIG: DB: ', module.exports.db);
