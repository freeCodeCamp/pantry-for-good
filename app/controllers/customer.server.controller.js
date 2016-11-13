'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
		errorHandler = require('./errors.server.controller'),
		Customer = mongoose.model('Customer'),
		User = mongoose.model('User'),
		_ = require('lodash'),
		async = require('async'),
		nodemailer = require('nodemailer'),
		config = require('../../config/config'),
		smtpTransport = nodemailer.createTransport(config.mailer.options);

/**
 * Private helper function for email notification
 */
var sendEmailStatus = function(req, res, customer) {
	if (req.body.status === 'Accepted') {
		var mailOptionsAccept = {
			to: customer.email,
			headers: {
				'X-MC-Template': 'accept-client',
				'X-MC-MergeVars': JSON.stringify({
					fullName: customer.fullName,
					date: customer.dateReceived.toDateString()
				})
			}
		};

		smtpTransport.sendMail(mailOptionsAccept, function(err) {
			if (err) return err;
		});

	} else if (req.body.status === 'Rejected') {
		var mailOptionsReject = {
			to: customer.email,
			headers: {
				'X-MC-Template': 'reject-client',
				'X-MC-MergeVars': JSON.stringify({
					fullName: customer.fullName,
					date: customer.dateReceived.toDateString()
				})
			}
		};

		smtpTransport.sendMail(mailOptionsReject, function(err) {
			if (err) return err;
		});
	}
};

var sendEmailUpdate = function(req, res, customer) {
	var mailOptionsUpdate = {
		to: config.mailer.to,
		headers: {
			'X-MC-Template': 'update-client',
			'X-MC-MergeVars': JSON.stringify({
				id: customer._id,
				fullName: customer.fullName,
				date: customer.dateReceived.toDateString()
			})
		}
	};

	smtpTransport.sendMail(mailOptionsUpdate, function(err) {
		if (err) return err;
	});
};

/**
 * Create a customer
 */
exports.create = function(req, res, next) {
	var customer = new Customer(req.body);
	customer._id = req.user.id;

	// Update user's hasApplied property to restrict them from applying again
	User.findOneAndUpdate({_id: customer._id}, {$set: {hasApplied: true}})
		.then(function(user) {
			async.waterfall([
				function(done) {
					customer.save(function(err) {
						if (err) {
							return res.status(400).send({
								message: errorHandler.getErrorMessage(err)
							});
						} else {
							res.json(customer);

							done(err, customer);
						}
					});
				},
				function(customer, done) {
					var mailOptionsCreate = {
						to: config.mailer.to,
						headers: {
							'X-MC-Template': 'new-client',
							'X-MC-MergeVars': JSON.stringify({
								id: customer._id,
								fullName: customer.fullName,
								date: customer.dateReceived.toDateString()
							})
						}
					};

					smtpTransport.sendMail(mailOptionsCreate, function(err) {
						done(err, 'done');
					});
				}
			], function(err) {
				if (err) return err;
			});
		})
		.catch(function (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		});

};

/**
 * Show the current customer
 */
exports.read = function(req, res) {
	res.json(req.customer);
};

/**
 * Update a customer
 */
exports.update = function(req, res) {
	var customer = req.customer;

	customer = _.extend(customer, req.body);

	Customer.findOne({'_id': customer._id})
		.exec()
		.then(function(customerOld) {
			// Send email notification when there is a status change
			if (customerOld.status !== customer.status) {
				sendEmailStatus(req, res, customer);

				// Assign the customer user role to the user in the case of application approval
				if (customer.status === 'Accepted') {
					User.findOneAndUpdate({_id: customer._id}, {$set: {roles: ['customer']}}, function(err) {
						if (err) {
							return res.status(400).send({
								message: errorHandler.getErrorMessage(err)
							});
						}
					});
				}
			} else {
				sendEmailUpdate(req, res, customer);
			}
		});

		customer.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.json(customer);
			}
		})
		.catch(function (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		});
};

/**
 * List of customers
 */
exports.list = function(req, res) {
	return Customer.find()
		.sort('-dateReceived')
		.populate('user', 'displayName')
		.populate('assignedTo', 'firstName lastName')
		.exec()
		.then(function(customers) {
			return res.json(customers);
		})
		.catch(function (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		});
};

/**
 * Delete customer
 */
exports.delete = function(req, res) {
	var id = req.customer._id;

	User.findByIdAndRemove(id)
		.exec()
		.then(function(user) {
		})
		.catch(function (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		});

	Customer.findByIdAndRemove(id)
		.exec()
		.then(function(customer) {
		})
		.catch(function (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		});

	res.end();
};

/**
 * Customer middleware
 */
exports.customerById = function(req, res, next, id) {
	Customer.findById(id)
		.exec()
		.then(function(customer) {
			if (!customer) return new Error('Failed to load customer #' + id);
			req.customer = customer;
		})
		.catch(function (err) {
			return err;
		})
		.asCallback(next);
};

/**
 * Customer authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.customer._id !== +req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};
