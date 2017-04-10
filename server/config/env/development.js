'use strict'

module.exports = {
  db: process.env.MONGODB_URI || 'mongodb://localhost/fb-dev',
  app: {
    title: 'Development Environment'
  }
}
