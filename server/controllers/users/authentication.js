import passport from 'passport'

import {User} from '../../models'

/**
 * Signup
 */
exports.signup = async function(req, res) {
  // Init Variables
  let user = new User({
    ...req.body,
    roles: [req.body.accountType].filter(role => role !== 'admin'),
    provider: 'local',
    displayName: `${req.body.firstName} ${req.body.lastName}`
  })

  await user.save()

  user.password = undefined
  user.salt = undefined

  req.login(user, err => {
    if (err) throw err //return res.status(400).json(err)
  })
  return res.json(user)
}

/**
 * Signin after passport authentication
 */
exports.signin = function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err || !user) {
      res.status(400).send(info)
    } else {
      // Remove sensitive data before login
      user.password = undefined
      user.salt = undefined

      req.login(user, function(err) {
        if (err) throw err //return  res.status(400).json(err);
        return res.json(user)
      })
    }
  })(req, res, next)
}

/**
 * Signout
 */
exports.signout = function(req, res) {
  req.logout()
  req.session.destroy(function() {
    res.redirect('/')
  })
}
