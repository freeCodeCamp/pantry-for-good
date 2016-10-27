'use strict';

/**
 * Module dependencies
 */
var media = require('../controllers/media.server.controller'),
    multer = require('multer');

module.exports = function(app) {
	// Media routes
	app.route('/api/media/uploadLogo')
		.post(multer( {
			dest: "public/media",
			renameFile: (fieldname, filename) => {
				console.log("fieldname is " + fieldname);
				console.log("filename is " + filename);
			},
			onFileUploadComplete: () => {
				console.log({ text: "hey, it's complete" });
			}
		}).single('file'), media.uploadLogo);

	app.route('/api/media')
		.post(media.save);
		
	app.route('/api/media')
		.get(media.read);

};
