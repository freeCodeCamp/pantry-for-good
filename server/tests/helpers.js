import express from 'express'

import setupPassport from '../config/passport'

/**
 * returns a user and express app where the user is authenticated
 *
 * @param {object} userModel new or existing user to create mock session for
 * @return {promise<object>}
 */
export const createUserSession = async function(userModel) {
  const app = require('../config/express').default
  const {User} = require('../models')
  setupPassport()

  const user = userModel._id ?
    userModel :
    await new User(userModel).save()

  const mockApp = express()
  mockApp.all('*', mockSessionMiddleware(user))
  mockApp.use(app())

  return {
    user,
    app: mockApp
  }
}

export const initApp = function() {
  const app = require('../config/express').default
  require('../config/passport')
  return app
}

/**
 * create a user model
 *
 * @param {string} username
 * @param {string} accountType
 * @param {object} props additional properties to set
 * @return {object}
 */
export const createTestUser = (username, accountType, props = null) => ({
  firstName: username,
  lastName: 'test',
  accountType: [accountType],
  email: `${username}@test.com`,
  password: 'password',
  provider: 'local',
  ...props
})

function mockSessionMiddleware({_id, roles}) {
  return (req, res, next) => {
    req.session = {
      passport: {user: {_id, roles}}
    }

    next()
  }
}
