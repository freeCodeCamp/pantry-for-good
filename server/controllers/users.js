'use strict'

/**
 * Module dependencies.
 */
var _ = require('lodash')

/**
 * Extend user's controller
 */
module.exports = _.extend(
  require('./users/authentication'),
  require('./users/authorization'),
  require('./users/password'),
  require('./users/profile')
)
