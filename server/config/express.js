import bodyParser from 'body-parser'
import compress from 'compression'
import cookieParser from 'cookie-parser'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import mongoose from 'mongoose'
import connectMongo from 'connect-mongo'
import passport from 'passport'
import path from 'path'
import session from 'express-session'
import {get} from 'lodash'

import {addUser} from '../lib/websocket-middleware'
import apiRoutes from '../routes/api'
import config from './index'
import enforceSSLMiddleware from '../lib/enforce-ssl-middleware'
import getErrorMessage, {HttpError} from '../lib/errors'
import seed from '../lib/seed'
import '../models'

// set api delay and failure probablility for testing
const API_DELAY = 0
const API_FAILURE_RATE = 0

const mongoStore = connectMongo({session})

export default function(io) {
  const app = express()

  const sharedSession = session({
    saveUninitialized: false,
    cookie: { maxAge: config.sessionIdleTimeout },
    resave: true,
    rolling: true,
    secret: config.sessionSecret,
    store: new mongoStore({
      mongooseConnection: mongoose.connection,
      collection: config.sessionCollection
    })
  })

  app.set('sharedSession', sharedSession)

  // call with true or delete db to seed
  seed(process.env.NODE_ENV, false)

  // force https
  if (process.env.NODE_ENV === 'production') {
    app.use(enforceSSLMiddleware)
  }

  app.use(compress({
    filter: function(req, res) {
      return (/json|text|javascript|css/).test(res.getHeader('Content-Type'))
    },
    level: 9
  }))

  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
  }

  app.use(bodyParser.urlencoded({
    extended: true
  }))
  app.use('/api/admin/pages', bodyParser.json({limit: '5mb'}))
  app.use(bodyParser.json({}))

  // CookieParser should be above session
  app.use(cookieParser())

  // Express MongoDB session storage
  app.use(sharedSession)

  // use passport session
  app.use(passport.initialize())
  app.use(passport.session())

  // Use helmet to secure Express headers
  app.use(helmet())
  app.disable('x-powered-by')

  app.use('/api', apiRoutes(API_DELAY, API_FAILURE_RATE))

  // Setting the static folder
  if (process.env.NODE_ENV === 'production')
    app.use(express.static(path.resolve('./dist/client')))

  // Error handler
  app.use(function(err, req, res, next) {
    if (!err) return next()

    // Dont log client errors or during testing
    if (process.env.NODE_ENV !== 'test' && !(err instanceof HttpError)) {
      console.error(err)
    }

    const error = getErrorMessage(err)
    res.status(error.status).json({
      message: error.message,
      ...(error.paths ? {paths: err.paths} : {})
    })
  })

  if (process.env.NODE_ENV === 'production') {
    app.use(function(req, res) {
      res.sendFile(path.resolve('./dist/client/index.html'))
    })
  }

  if (io) {
    io.on('connection', socket => {
      const user = get(socket.handshake.session, 'passport.user')
      if (user) addUser(user, socket)
    })
  }

  // Return Express server instance
  return app
}
