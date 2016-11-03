'use strict';
// Get template configuration from file
var appconfig = require('../../app-config.json');

module.exports = {
	db: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || appconfig.mongodb_prod
};

console.log('APP CONFIG: DB: ', module.exports.db);
