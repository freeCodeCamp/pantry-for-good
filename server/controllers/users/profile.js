import {extend} from 'lodash'

import {BadRequestError, UnauthorizedError} from '../../lib/errors'
import User from '../../models/user'

/**
 * List users
 */
export const list = async function(req, res) {
  const users = await User.find({}).lean()
  res.json(users)
}

/**
 * Get a user by userId
 */
export const getById = async function(req, res) {
  if (!req.params.userId.match(/^\d+$/)){
    throw new BadRequestError(`UserId ${req.params.userId} is not valid`)
  }
  const user = await User.findById(req.params.userId).lean()
  if (user) {
    res.json(user)
  } else {
    throw new
    BadRequestError(`UserId ${req.params.userId} not found`)
  }
}

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

  if (!user.firstName || !user.lastName) throw new BadRequestError("Fist Name and Last Name are required")

  const sameEmail = await User.findOne({email: req.user.email}).lean()
  if (sameEmail && sameEmail._id !== req.user._id)
    throw new BadRequestError('Email address is taken')

  await user.save()
  res.json(user)
}

/**
 * Send User
 */
export const me = async function(req, res) {
  if (!req.session.passport) return res.json(null)

  const user = await User.findById(req.session.passport.user)
  return res.json(user)
}
