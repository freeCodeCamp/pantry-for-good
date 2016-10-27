'use strict';

/**
 * Module dependencies
 */
var media = require('../controllers/media.server.controller'),
    multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/media');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

var upload = multer({ storage: storage });

module.exports = function(app) {
	// Media routes
	app.route('/api/media/uploadLogo')
		.post(multer({storage:storage}).single('file'), media.uploadLogo);

	app.route('/api/media')
		.post(media.save);
		
	app.route('/api/media')
		.get(media.read);

};
