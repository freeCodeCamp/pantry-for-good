import mongoose from 'mongoose'
import autoIncrement from 'mongoose-auto-increment'

import config from './config'
import setupPassport from './config/passport'

/* eslint-disable no-console */
process.on('unhandledRejection', err => console.log(err))

mongoose.Promise = global.Promise
mongoose.connect(config.db)
const db = mongoose.connection


db.on('error', function(err) {
  console.error('Mongoose error', err)
})

db.once('open', function() {
  console.log('Connected to', config.db)

  autoIncrement.initialize(db)
  const app = require('./config/express').default()
  setupPassport()
  app.listen(config.port)

  console.log('Application started on port', config.port)
})
