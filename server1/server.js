import mongoose from 'mongoose'
import http from 'http'
import socketIO from 'socket.io'
import socketIOSession from 'express-socket.io-session'

import config from './config'
import setupPassport from './config/passport'
import setupExpress from './config/express'

process.on('unhandledRejection', err => console.error(err))

mongoose.Promise = global.Promise
mongoose.connect(config.db)
const db = mongoose.connection

db.on('error', function(err) {
  console.error('Mongoose error', err)
})

db.once('open', function() {
  console.info('Connected to', config.db)

  const io = socketIO()
  const app = setupExpress(io)
  const server = http.createServer(app).listen(config.port)

  setupPassport()

  io.listen(server)
  io.use(socketIOSession(app.get('sharedSession')))

  console.info('Application started on port', config.port)
})
