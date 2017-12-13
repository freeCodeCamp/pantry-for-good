import express from 'express'

import setupPassport from '../config/passport'
import app from '../config/express'
import User from '../models/user'

/**
 * returns a user and express app where the user is authenticated
 *
 * @param {object} userModel new or existing user to create mock session for
 * @return {promise<object>}
 */
export const createUserSession = async function(userModel) {
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

/**
 * create an express app without an authenticated user
 * 
 * @return {object}
 */
export const createGuestSession = function() {
  setupPassport()
  const mockApp = express()
  mockApp.use(app())

  return mockApp
}

/**
 * create a user model
 *
 * @param {string} username
 * @param {string} role
 * @param {object} props additional properties to set
 * @return {object}
 */
export const createTestUser = (username, role, props = null) => ({
  firstName: username,
  lastName: 'test',
  roles: [role],
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
