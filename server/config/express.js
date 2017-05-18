import bodyParser from 'body-parser'
import compress from 'compression'
import cookieParser from 'cookie-parser'
import express from 'express'
import flash from 'connect-flash'
import helmet from 'helmet'
import methodOverride from 'method-override'
import morgan from 'morgan'
import mongoose from 'mongoose'
import connectMongo from 'connect-mongo'
import nunjucks from 'nunjucks'
import passport from 'passport'
import path from 'path'
import session from 'express-session'

import apiRoutes from '../routes/api'
import config from './index'
import getErrorMessage from '../lib/error-messages'
import '../models'
import seed from '../lib/seed'

// set api delay and failure probablility for testing
const API_DELAY = 0
const API_FAILURE_RATE = 0

const mongoStore = connectMongo({session})

export default function() {
  const app = express()

  // call with true or delete db to seed
  seed(process.env.NODE_ENV, false)

  // Should be placed before express.static
  app.use(compress({
    filter: function(req, res) {
      return (/json|text|javascript|css/).test(res.getHeader('Content-Type'))
    },
    level: 9
  }))

  // Showing stack errors
  app.set('showStackError', true)

  // add filter from swig for backwards compatibility
  nunjucks.configure(path.join(__dirname, '/../views'), {
    autoescape: false,
    express: app
  })

  // Environment dependent middleware
  if (process.env.NODE_ENV === 'development') {
    // Enable logger (morgan)
    app.use(morgan('dev'))

    // Disable views cache
    app.set('view cache', false)
  } else if (process.env.NODE_ENV === 'production') {
    app.locals.cache = 'memory'
  }

  // Request body parsing middleware should be above methodOverride
  app.use(bodyParser.urlencoded({
    extended: true
  }))
  app.use(bodyParser.json())
  app.use(methodOverride())

  // CookieParser should be above session
  app.use(cookieParser())

  // Express MongoDB session storage
  app.use(session({
    saveUninitialized: false,
    resave: true,
    secret: config.sessionSecret,
    store: new mongoStore({
      mongooseConnection: mongoose.connection,
      collection: config.sessionCollection
    })
  }))

  // use passport session
  app.use(passport.initialize())
  app.use(passport.session())

  // connect flash for flash messages
  app.use(flash())

  // Use helmet to secure Express headers
  app.use(helmet())
  app.disable('x-powered-by')

  // Use api routes
  app.use('/api', apiRoutes(API_DELAY, API_FAILURE_RATE))

  // Setting the static folder
  app.use(express.static(path.resolve('./assets')))

  // Error handler
  app.use(function(err, req, res, next) {
    if (!err) return next()

    // Dont log during testing
    if (process.env.NODE_ENV !== 'test') {
      // eslint-disable-next-line no-console
      console.error(err.stack)
    }

    const error = getErrorMessage(err)
    res.status(error.status).json({
      message: error.message
    })
  })

  // let the client handle it
  app.use(function(req, res) {
    res.sendFile(path.resolve('./assets/index.html'))
    // res.end()
    // res.status(404).json({
    //   message: 'Not found'
    // })
  })

  // Return Express server instance
  return app
}
