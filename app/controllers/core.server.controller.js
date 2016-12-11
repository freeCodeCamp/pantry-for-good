'use strict';

/**
 * Module dependencies.
 */
exports.index = function(req, res) {
	res.render('index', {
		googleKey: process.env.GOOGLE_MAPS_API_KEY || null,
		user: req.user || null,
		request: req
	});
};
