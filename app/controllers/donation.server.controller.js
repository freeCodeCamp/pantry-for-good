'use strict';

/**
 * Module dependencies
 */
var mongoose 			= require('mongoose'),
		errorHandler 	= require('./errors.server.controller'),
		Donation 			= mongoose.model('Donation'),
		async 				= require('async'),
		nodemailer 		= require('nodemailer'),
		config 				= require('../../config/config'),
		smtpTransport = nodemailer.createTransport(config.mailer.options),
		phantom 			= require('node-phantom-simple'),
		fs						= require('fs');
		
/**
 * Create a donation
 */
exports.create = function(req, res) {
	var donation = new Donation(req.body);

	donation.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(donation);
		}
	});
};

/**
 * Send email receipt
 */
exports.sendEmail = function(req, res, next) {
	var donation = req.body;
	donation.donorEmail = req.donor.email;
	
	var temp = new Date(donation.dateIssued).toDateString().split(' ').splice(1);
	donation.dateIssued = temp[0] + ' ' + temp[1] + ', ' + temp[2];

	async.waterfall([
		function(done) {
			res.render('templates/donation-attachment-email', donation, function(err, emailHTMLAttachment) {
				phantom.create(function(err, ph) {
					ph.createPage(function(err, page) {
						page.set('content', emailHTMLAttachment);
						page.set('viewportSize', { width: 650, height: 720 });
						page.render('tax-receipt.png', { format: 'png', quality: '100' }, function() {
							console.log('E-mail attachment page rendered');
							ph.exit();
							done(err);
						});
					});
				});
			});
		},
		function(done) {
			var mailOptions = {
				to: donation.donorEmail,
				headers: {
					'X-MC-Template': 'donation',
					'X-MC-MergeVars': JSON.stringify({
						fullName: donation.donorName,
						date: donation.dateIssued,
						amount: donation.eligibleForTax
					})
				},
				attachments: [{
					filename: donation._id + '-tax-receipt.png',
					path: './tax-receipt.png'
				}]
			};

			smtpTransport.sendMail(mailOptions, function(err) {
				fs.unlinkSync('./tax-receipt.png');
				done(err, 'done');
			});
		}
	], function(err) {
		if (err) return next(err);
	});

	res.end();
};
