import crypto from 'crypto'
import thenify from 'thenify'

import config from '../../config'
import mailer from '../../lib/mail/mail-helpers'
import User from '../../models/user'

const randomBytes = thenify(crypto.randomBytes)

/**
 * Forgot password
 */
export const forgot = async function(req, res) {
  if (!config.sendgrid.API_KEY) {
    return res.status(500).json({message: "This site does not have email capability at this time. Please contact the site owner for assistance."})
  }

  const token = (await randomBytes(20)).toString('hex')

  // Lookup user by email
  if (!req.body.email) return res.status(400).send({message: 'Email is required'})
  const user = await User.findOne({email: req.body.email}).select('-salt -password')
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

    await user.save()
  }

  const url = `http://${req.headers.host}/users/reset-password/${token}`
  try {
    await mailer.sendPasswordReset(user, url)
    res.send({message: 'Password reset email sent'})
  } catch (err) {
    res.status(500).send({message: 'Error sending password reset email'})
  }
}

/**
 * Reset password POST from email token
 */
export const reset = async function (req, res) {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: {$gt: Date.now()}
  })

  if (!user) {
    return res.status(400).send({message: 'Password reset token is invalid or has expired.'})
  }

  user.password = req.body.password
  user.resetPasswordToken = undefined
  user.resetPasswordExpires = undefined

  await user.save()
  res.json({message: "Password successfully reset"})
}

/**
 * Change Password
 */
export const changePassword = async function(req, res) {
  const {newPassword, currentPassword, verifyPassword} = req.body.passwordDetails

  if (!req.user || !newPassword || !currentPassword || newPassword !== verifyPassword) {
    return res.status(400).send({message: 'Invalid request'})
  }

  const user = await User.findById(req.user.id)
  if (!user) return res.status(400).send({message: 'Invalid request'})
  if (!user.authenticate(currentPassword))
    return res.status(400).send({message: 'Password is incorrect'})

  user.password = newPassword
  await user.save()

  req.login(user, function(err) {
    if (err) res.status(400).send(err)
    return res.send({message: 'Password changed successfully'})
  })
}
