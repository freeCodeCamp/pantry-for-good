import {extend, includes} from 'lodash'

import {ADMIN_ROLE} from '../../../common/constants'
import {BadRequestError} from '../../lib/errors'
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
  if (user._id !== req.body._id)
    user = await User.findById(req.body._id)

  // For security measurement we remove the roles from the req.body object
  delete req.body.roles

  // Merge existing user
  user = extend(user, req.body)

  if (!user.firstName || !user.lastName) throw new BadRequestError('First Name and Last Name are required')

  user.updated = Date.now()
  user.displayName = user.firstName + ' ' + user.lastName

  const sameEmail = await User.findOne({email: req.user.email}).lean()
  if (sameEmail && sameEmail._id !== req.user._id)
    throw new BadRequestError('Email address is taken')

  // Update admin status
  if (includes(req.user, ADMIN_ROLE)) {
    const alreadyAdmin = includes(user.roles, ADMIN_ROLE)
    if (user.isAdmin && !alreadyAdmin) {
      user.roles.push(ADMIN_ROLE)
    } else if (!user.isAdmin && alreadyAdmin) {
      if (parseInt(req.params.userId, 10) === req.user._id)
        throw new BadRequestError('You are not allowed to demote yourself')
      user.roles.splice(user.roles.indexOf(ADMIN_ROLE), 1)
    }
    delete user.isAdmin
  }

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
