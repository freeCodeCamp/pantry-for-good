import intersection from 'lodash/intersection'

import {ForbiddenError, NotFoundError, UnauthorizedError} from '../../lib/errors'
import User from '../../models/user'

/**
 * User middleware
 */
export const userByID = async function(req, res, next, id) {
  const user = User.findById(id)
  if (!user) throw new NotFoundError

  req.profile = user
  next()
}

/**
 * Require login routing middleware
 */
export const requiresLogin = function(req, res, next) {
  if (!req.isAuthenticated()) {
    throw new UnauthorizedError
  }
  next()
}

/**
 * User authorizations routing middleware
 */
export const hasAuthorization = function(roles) {
  return (req, res, next) => {
    this.requiresLogin(req, res, function() {
      if (!intersection(req.user.roles, roles).length) {
        throw new ForbiddenError
      }

      next()
    })
  }
}
