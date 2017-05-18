'use strict'
import User from '../../models/user'
/**
 * Module dependencies.
 */
var _ = require('lodash'),
  errorHandler = require('../errors')

/**
 * Update user details
 */
exports.update = function(req, res) {
  // Init Variables
  var user = req.user

  // For security measurement we remove the roles from the req.body object
  delete req.body.roles

  if (user) {
    // Merge existing user
    user = _.extend(user, req.body)
    user.updated = Date.now()
    user.displayName = user.firstName + ' ' + user.lastName

    user.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        })
      } else {
        req.login(user, function(err) {
          if (err) {
            res.status(400).send(err)
          } else {
            res.json(user)
          }
        })
      }
    })
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    })
  }
}

/**
 * Send User
 */
exports.me = function(req, res) {
  //res.json(req.user || null);
  // not bootstrapping client with user data now, use this endpoint for client to request user data
  if (!req.session.passport) return res.json(null)
  User.findById(req.session.passport.user, '-password -salt', function(err, response) {
    if (err) return res.json(null)
    return res.json(response)
  })
}
