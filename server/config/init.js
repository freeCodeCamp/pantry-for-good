'use strict'

require('dotenv').load({silent: true}) // Load environment variables from .env

/**
 * Module dependencies.
 */
var glob = require('glob'),
  chalk = require('chalk')

/**
 * Module init function.
 */
module.exports = function() {
  /**
   * Before we begin, lets set the environment variable
   * We'll Look for a valid NODE_ENV variable and if one cannot be found load the development NODE_ENV
   */
  var environmentFiles = glob.sync('./config/env/' + process.env.NODE_ENV + '.js')

  if (!environmentFiles.length) {
    if (process.env.NODE_ENV) {
      // eslint-disable-next-line no-console
      console.error(chalk.red('No configuration file found for "' + process.env.NODE_ENV + '" environment using development instead'))
    } else {
      // eslint-disable-next-line no-console
      console.error(chalk.red('NODE_ENV is not defined! Using default development environment'))
    }

    process.env.NODE_ENV = 'development'
  } else {
    // eslint-disable-next-line no-console
    console.log(chalk.black.bgWhite('Application loaded using the "' + process.env.NODE_ENV + '" environment configuration'))
  }

}
