import User from '../../models/user'
import intersection from 'lodash/intersection'
/**
 * User middleware
 */
exports.userByID = function(req, res, next, id) {
  User.findOne({
    _id: id
  }).exec(function(err, user) {
    if (err) return next(err)
    if (!user) return next(new Error('Failed to load User ' + id))
    req.profile = user
    next()
  })
}

/**
 * Require login routing middleware
 */
exports.requiresLogin = function(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).send({
      message: 'User is not logged in'
    })
  }
  next()
}

/**
 * User authorizations routing middleware
 */
exports.hasAuthorization = function(roles) {
  return (req, res, next) => {
    this.requiresLogin(req, res, function() {
      if (intersection(req.user.roles, roles).length) {
        return next()
      } else {
        return res.status(403).send({
          message: 'User is not authorized'
        })
      }
    })
  }
}
