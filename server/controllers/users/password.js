'use strict'
import User from '../../models/user'
import Settings from '../../models/settings'
/**
 * Module dependencies.
 */
var _ = require('lodash'),
  errorHandler = require('../errors'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  // User = mongoose.model('User'),
  // Settings = mongoose.model('Settings'),
  config = require('../../config/index'),
  async = require('async'),
  mailHelper = require('sendgrid').mail,
  crypto = require('crypto')

/**
 * Forgot for reset password (forgot POST)
 */
exports.forgot = function(req, res, next) {
  async.waterfall([
    // Generate random token
    function(done) {
      crypto.randomBytes(20, function(err, buffer) {
        var token = buffer.toString('hex')
        done(err, token)
      })
    },
    // Lookup user by username
    function(token, done) {
      if (req.body.username) {
        User.findOne({
          username: req.body.username
        }, '-salt -password', function(err, user) {
          if (!user) {
            return res.status(400).send({
              message: 'No account with that username has been found'
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
          message: 'Username field must not be blank'
        })
      }
    },
    function(token, user, done) {
      Settings.findOne({}, function(err, settings) {
        if (err)
          return res.status(400).send({
            message: "Server Error"
          })
        done(err, token, user, settings)
      })
    },
    function(token, user, settings, done) {
      res.render('templates/reset-password-email', {
        name: user.displayName,
        appName: config.app.title,
        tconfig: settings,
        url: 'http://' + req.headers.host + '/#!/password/reset/' + token
      }, function(err, emailHTML) {
        done(err, emailHTML, user)
      })
    },
    // If valid email, send reset email using service
    function(emailHTML, user, done) {
      var from_email = new mailHelper.Email(config.mailer.from)
      var to_email = new mailHelper.Email(user.email)
      var sg = require('sendgrid')(config.mailer.sendgridKey)
      var sgContent = new mailHelper.Content('text/html', emailHTML)
      var mail = new mailHelper.Mail(from_email, "Password Reset", to_email, sgContent)
      var request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON()
      })

      sg.API(request, function(error, response) {
        if (error) {
          console.log(error)
          console.log(response.body.errors)
          res.status(500).send({
            message: "Server Error"
          })
        } else {
          res.send({
            message: 'An email has been sent to ' + user.email + ' with further instructions.'
          })
        }
      })

      /*var smtpTransport = nodemailer.createTransport(config.mailer.options);
      var mailOptions = {
        to: user.email,
        from: config.mailer.from.first,
        subject: 'Password Reset',
        html: emailHTML
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        if (!err) {
          res.send({
            message: 'An email has been sent to ' + user.email + ' with further instructions.'
          });
        }

        done(err);
      });*/
    }
  ], function(err) {
    if (err) return next(err)
  })
}

/**
 * Reset password GET from email token
 */
exports.validateResetToken = function(req, res) {
  User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: {
      $gt: Date.now()
    }
  }, function(err, user) {
    if (!user) {
      return res.redirect('/#!/password/reset/invalid')
    }

    res.redirect('/#!/password/reset/' + req.params.token)
  })
}

/**
 * Reset password POST from email token
 */
exports.reset = function(req, res, next) {
  // Init Variables
  var passwordDetails = req.body

  async.waterfall([

    function(done) {
      User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {
          $gt: Date.now()
        }
      }, function(err, user) {
        if (!err && user) {
          if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
            user.password = passwordDetails.newPassword
            user.resetPasswordToken = undefined
            user.resetPasswordExpires = undefined

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
                    // Return authenticated user
                    res.json(user)

                    done(err, user)
                  }
                })
              }
            })
          } else {
            return res.status(400).send({
              message: 'Passwords do not match'
            })
          }
        } else {
          return res.status(400).send({
            message: 'Password reset token is invalid or has expired.'
          })
        }
      })
    },
    function(user, done) {
      res.render('templates/reset-password-confirm-email', {
        name: user.displayName,
        appName: config.app.title
      }, function(err, emailHTML) {
        done(err, emailHTML, user)
      })
    },
    // If valid email, send reset email using service
    function(emailHTML, user, done) {
      var from_email = new mailHelper.Email(config.mailer.from)
      var to_email = new mailHelper.Email(user.email)
      var sg = require('sendgrid')(config.mailer.sendgridKey)
      var sgContent = new mailHelper.Content('text/html', emailHTML)
      var mail = new mailHelper.Mail(from_email, 'Your password has been changed.', to_email, sgContent)
      var request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON()
      })

      sg.API(request, function(error, response) {
        if (error) {
          console.log(error)
          console.log(response.body.errors)
        } else {
          done(error, 'done')
        }
      })
      /*var smtpTransport = nodemailer.createTransport(config.mailer.options);
      var mailOptions = {
        to: user.email,
        from: config.mailer.from.first,
        subject: 'Your password has been changed',
        html: emailHTML
      };

      smtpTransport.sendMail(mailOptions, function(err) {
        done(err, 'done');
      });*/
    }
  ], function(err) {
    if (err) return next(err)
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
