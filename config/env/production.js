'use strict';
// Get template configuration from file
var appconfig = require('../../app-config.json');

module.exports = {
	db: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/fb-prod'
};

console.log('APP CONFIG: DB: ', module.exports.db);
