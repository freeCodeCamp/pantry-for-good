'use strict'

module.exports = {
  db: process.env.MONGODB_URI || 'mongodb://localhost:27017/fb-prod',
  app: {
    title: 'Food Bank'
  }
}
