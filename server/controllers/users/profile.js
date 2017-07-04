import {extend} from 'lodash'

import {BadRequestError, UnauthorizedError} from '../../lib/errors'
import User from '../../models/user'

/**
 * Update user details
 */
export const update = async function(req, res) {
  let user = req.user

  // For security measurement we remove the roles from the req.body object
  delete req.body.roles

  if (!user) throw new UnauthorizedError
  // Merge existing user
  user = extend(user, req.body)
  user.updated = Date.now()
  user.displayName = user.firstName + ' ' + user.lastName

  if (!user.firstName || !user.lastName) throw new BadRequestError

  const sameEmail = await User.findOne({email: req.user.email}).lean()
  if (sameEmail && sameEmail._id !== req.user._id)
    throw new BadRequestError('Email address is taken')

  await user.save()

  req.login(user, function(err) {
    if (err) throw new UnauthorizedError
    res.json(user)
  })
}

/**
 * Send User
 */
export const me = async function(req, res) {
  if (!req.session.passport) return res.json(null)

  const user = await User.findById(req.session.passport.user).select('-password -salt')
  return res.json(user)
}
