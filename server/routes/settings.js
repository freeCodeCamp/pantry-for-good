'use strict'

/**
 * Module dependencies
 */
var express = require('express')
var settings = require('../controllers/settings')

var settingsRouter = express.Router({mergeParams: true})

// Settings routes
settingsRouter.route('/settings')
  .post(settings.save)

settingsRouter.route('/settings')
  .get(settings.read)

module.exports = settingsRouter
