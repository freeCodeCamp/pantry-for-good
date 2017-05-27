import async from 'async'
import crypto from 'crypto'

import User from '../../models/user'
import Settings from '../../models/settings'
import { sendEmail } from '../../config/mailer'
import errorHandler from '../errors'

/**
 * Forgot for reset password (forgot POST)
 */
exports.forgot = function(req, res) {
  if (!sendEmail) {
    return res.status(500).json({message: "This site does not have email capability at this time. Please contact the site owner for assistance."})
  }
  async.waterfall([

    // Generate random token
    function(done) {
      crypto.randomBytes(20, function(err, buffer) {
        var token = buffer.toString('hex')
        done(err, token)
      })
    }.bind(this),

    // Lookup user by email
    function(token, done) {
      if (req.body.email) {
        User.findOne({
          email: req.body.email
        }, '-salt -password', function(err, user) {
          if (!user) {
            return res.status(400).send({
              message: 'No account with that email has been found'
            })
          } else if (user.provider !== 'local') {
            return res.status(400).send({
              message: 'It seems like you signed up using your ' + user.provider + ' account'
            })
          } else {
            user.resetPasswordToken = token
            user.resetPasswordExpires = Date.now() + 3600000 // 1 hour

            user.save(function(err) {
              done(err, token, user)
            })
          }
        })
      } else {
        return res.status(400).send({
          message: 'Email field must not be blank'
        })
      }
    }.bind(this),

    // fetch application settings
    function(token, user, done) {
      Settings.findOne({}, function(err, settings) {
        if (err)
          return res.status(400).send({
            message: "Server Error"
          })
        done(err, token, user, settings)
      })
    }.bind(this),

    // generate email message
    function(token, user, settings, done) {
      res.render('templates/reset-password-email.html', {
        name: user.displayName,
        organization: settings.organization,
        url: `http://${req.headers.host}/users/reset-password/${token}`
      }, function (err, emailHTML) {
        done(err, emailHTML, user, settings.organization)
      })
    }.bind(this),

    // send email message
    function(emailHTML, user, organization, done) {
      sendEmail(user.email, user.displayName, `${organization} Password Reset`, emailHTML).then(() => {
        res.send({
          message: `An email has been sent to ${user.email} with further instructions.`
        })
        done()
      })
      .catch(err => done(err))
    }.bind(this)

  ], function(err) {
    if (err)
      return res.status(500).json(err)
  })
}

/**
 * Reset password POST from email token
 */
exports.reset = function (req, res) {

  User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  }, function (err, user) {
    if (err) {
      return res.status(400).send({ message: errorHandler.getErrorMessage(err) })
    }
    if (!user) {
      return res.status(400).send({ message: 'Password reset token is invalid or has expired.' })
    }

    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined

    user.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        })
      }
      return res.json({message: "Password successfully reset"})
    })
  })
}

/**
 * Change Password
 */
exports.changePassword = function(req, res) {
  // Init Variables
  var passwordDetails = req.body

  if (req.user) {
    if (passwordDetails.newPassword) {
      User.findById(req.user.id, function(err, user) {
        if (!err && user) {
          if (user.authenticate(passwordDetails.currentPassword)) {
            if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
              user.password = passwordDetails.newPassword

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
                      res.send({
                        message: 'Password changed successfully'
                      })
                    }
                  })
                }
              })
            } else {
              res.status(400).send({
                message: 'Passwords do not match'
              })
            }
          } else {
            res.status(400).send({
              message: 'Current password is incorrect'
            })
          }
        } else {
          res.status(400).send({
            message: 'User is not found'
          })
        }
      })
    } else {
      res.status(400).send({
        message: 'Please provide a new password'
      })
    }
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    })
  }
}
