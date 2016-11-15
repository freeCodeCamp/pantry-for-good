var init = require('./config/init')(),
	config = require('./config/config'),
	credentials = require("./admin-config.json"),
	mongoose = require('mongoose'),
	autoIncrement = require('mongoose-auto-increment'),
	chalk = require('chalk');

mongoose.Promise = require('bluebird');

mongoose.connect(config.db);

var db = mongoose.connection;

db.on('error', function(err) {
		console.error(chalk.red('Could not connect to MongoDB!'));
		console.log(chalk.red(err));
});

db.once('open', function() {
	console.log("Connected to " + config.db);

	autoIncrement.initialize(db);

	require("./app/models/user.server.model.js");

	credentials.accountType = "admin";

	User = mongoose.model('User');
	const admin = new User(credentials);
	admin.displayName = admin.firstName + ' ' + admin.lastName;
	admin.provider = "local";
	admin.roles = ["admin"];

	// Then save the user 
	admin.save(function(err) {
		if (err) {
			if (err.code === 11000)
				console.log(chalk.red('User ' + admin.username + ' already exists!'));
			else {
				console.error(chalk.red('Could not write to database!'));
				console.log(chalk.red(err));
			}
		} else {
			console.log("Successfully created admin user " + admin.username + ".");
		}
		mongoose.connection.close();
	});
});
