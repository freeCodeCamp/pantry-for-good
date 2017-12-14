import {extend, includes, pick} from 'lodash'

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
 * Updating own profile
 */
export const updateProfile = async function(req, res) {
  const user = req.user
  extend(user, pick(req.body, ['firstName', 'lastName', 'email']))

  if (!user.firstName || !user.lastName) throw new BadRequestError('First Name and Last Name are required')
  
  user.updated = Date.now()
  user.displayName = user.firstName + ' ' + user.lastName

  const sameEmail = await User.findOne({email: user.email}).lean()
  if (sameEmail && sameEmail._id !== user._id)
    throw new BadRequestError('Email address is taken')

  await user.save()
  res.json(user)
}

/**
 * Update user details
 */
export const update = async function(req, res) {
  let user = req.user
  if (user._id !== req.body._id)
    user = await User.findById(req.body._id)

  // Merge existing user
  extend(user, pick(req.body, ['firstName', 'lastName', 'email']))

  if (!user.firstName || !user.lastName) throw new BadRequestError('First Name and Last Name are required')

  user.updated = Date.now()
  user.displayName = user.firstName + ' ' + user.lastName

  const sameEmail = await User.findOne({email: user.email}).lean()
  if (sameEmail && sameEmail._id !== user._id)
    throw new BadRequestError('Email address is taken')

  // Update admin status
  const authenticatedUserIsAdmin = includes(req.user.roles, ADMIN_ROLE)

  if (authenticatedUserIsAdmin) {
    const previouslyAdmin = includes(user.roles, ADMIN_ROLE)
    const currentlyAdmin = req.body.isAdmin

    if (currentlyAdmin && !previouslyAdmin) {
      user.roles.push(ADMIN_ROLE)
    } else if (!currentlyAdmin && previouslyAdmin) {
      if (user._id === req.user._id)
        throw new BadRequestError('You are not allowed to demote yourself')

      user.roles.splice(user.roles.indexOf(ADMIN_ROLE), 1)
    }
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
