import crypto from 'crypto'
import thenify from 'thenify'

import config from '../../config'
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError
  // ValidationError
} from '../../lib/errors'
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
  if (!req.body.email) throw new BadRequestError('Email is required')
  const user = await User.findOne({email: req.body.email}).select('-salt -password')
  if (user && user.provider !== 'local') {
    if (user.provider === 'google') await mailer.sendPasswordGoogle(user)
  } else if (user && user.provider === 'local') {
    user.resetPasswordToken = token
    user.resetPasswordExpires = Date.now() + 3600000 // 1 hour

    const port = process.env.NODE_ENV === 'production' ? '' : `:${config.port}`
    const url = `${config.protocol}://${config.host}${port}/users/reset-password/${token}`

    await mailer.sendPasswordReset(user, url)
    await user.save()
  }

  res.send({message: 'Password reset email sent'})
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
    throw new BadRequestError('Password reset token is invalid or has expired.')
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
    throw new BadRequestError
  }

  const user = await User.findById(req.user.id).select('+salt +password')
  if (!user) throw new NotFoundError
  if (!user.authenticate(currentPassword))
    throw new BadRequestError('Password is incorrect')

  user.password = newPassword
  await user.save()

  req.login(user, function(err) {
    if (err) throw new UnauthorizedError
    return res.send({message: 'Password changed successfully'})
  })
}
