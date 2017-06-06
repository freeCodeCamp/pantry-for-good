import mongoose from 'mongoose'
import autoIncrement from 'mongoose-auto-increment'
import http from 'http'
import socketIO from 'socket.io'
import socketIOSession from 'express-socket.io-session'

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

  const io = socketIO()
  const app = require('./config/express').default(io)
  const server = http.createServer(app).listen(config.port)

  setupPassport()

  io.listen(server)
  io.use(socketIOSession(app.get('sharedSession')))

  console.log('Application started on port', config.port)
})
