import {extend} from 'lodash'
import errorHandler from '../errors'
import User from '../../models/user'

/**
 * Update user details
 */
export const update = function(req, res) {
  // Init Variables
  let user = req.user

  // For security measurement we remove the roles from the req.body object
  delete req.body.roles

  if (user) {
    // Merge existing user
    user = extend(user, req.body)
    user.updated = Date.now()
    user.displayName = user.firstName + ' ' + user.lastName

    user.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        })
      } else {
        req.login(user, function(err) {
          if (err) {
            res.status(400).send(err)
          } else {
            res.json(user)
          }
        })
      }
    })
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    })
  }
}

/**
 * Send User
 */
export const me = function(req, res) {
  if (!req.session.passport) return res.json(null)
  User.findById(req.session.passport.user, '-password -salt', function(err, response) {
    if (err) return res.json(null)
    return res.json(response)
  })
}
