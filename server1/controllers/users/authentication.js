import {map, pick} from 'lodash'
import passport from 'passport'

import {UnauthorizedError, ValidationError} from '../../lib/errors'
import User from '../../models/user'

/**
 * Signup
 */
export const signup = async function(req, res) {
  // Init Variables
  let user = new User({
    ...(pick(req.body, ['firstName', 'lastName', 'email', 'password'])),
    roles: [],
    provider: 'local',
    displayName: `${req.body.firstName} ${req.body.lastName}`
  })

  try {
    await user.save()
  } catch (error) {
    // Check for unique key violation from email
    if (error.code === 11000 && error.errmsg.match('email')) {
      throw new ValidationError({email: 'Email address already has an account'})
    } else if (error.name === 'ValidationError') {
      const errors = Object.assign(
        {},
        ...map(error.errors, (v, k) => ({[k]: v.message}))
      )

      throw new ValidationError(errors)
    } else {
      throw error
    }
  }

  user.password = undefined
  user.salt = undefined

  req.login(user, err => {
    if (err) throw new UnauthorizedError
  })
  return res.json(user)
}

/**
 * Signin after passport authentication
 */
export const signin = function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err || !user) {
      res.status(400).send(info)
    } else {
      // Remove sensitive data before login
      user.password = undefined
      user.salt = undefined

      req.login(user, function(err) {
        if (err) throw new UnauthorizedError
        return res.json(user)
      })
    }
  })(req, res, next)
}

/**
 * Signout
 */
export const signout = function(req, res) {
  req.logout()
  req.session.destroy(function() {
    res.redirect('/')
  })
}
