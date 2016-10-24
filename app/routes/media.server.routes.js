'use strict';

/**
 * Module dependencies
 */
var media = require('../controllers/media.server.controller'),
		upload = require('multer')({ dest: "public/media" });

module.exports = function(app) {
	// Media routes
	app.route('/api/media/uploadLogo')
		.post(upload.single('file'), media.uploadLogo);

	app.route('/api/media')
		.post(media.save);
		
	app.route('/api/media')
		.get(media.read);

};
