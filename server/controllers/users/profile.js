import {extend, includes, omit, pick} from 'lodash'

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
 * Updating own notifications profile
 */
export const updateNotifications = async function(req, res) {
  const user = req.user
  extend(user, pick(req.body, ['notifications']))

  user.updated = Date.now()

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
  // TODO: why doesn't `req.profile` have a save method?
  const user = await User.findById(req.params.userId)

  extend(user, omit(req.body, ['_id', 'isAdmin']))

  if (!user.firstName || !user.lastName) throw new BadRequestError('First Name and Last Name are required')

  user.updated = Date.now()
  user.displayName = user.firstName + ' ' + user.lastName

  const sameEmail = await User.findOne({email: user.email}).lean()
  if (sameEmail && sameEmail._id !== user._id)
    throw new BadRequestError('Email address is taken')

  // Update admin status
  const previouslyAdmin = includes(user.roles, ADMIN_ROLE)
  const currentlyAdmin = req.body.isAdmin

  if (currentlyAdmin && !previouslyAdmin) {
    user.roles.push(ADMIN_ROLE)
  } else if (!currentlyAdmin && previouslyAdmin) {
    if (user._id === req.user._id)
      throw new BadRequestError('You are not allowed to demote yourself')

    user.roles.splice(user.roles.indexOf(ADMIN_ROLE), 1)
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

/**
 * List own notifications profile
 */
export const listNotifications = async function(req, res) {
  const user = req.user
  res.json(user.notifications)
}

/**
 * Remove own notification profile
 */
export const removeNotification = async function(req, res) {
  //console.log('removeNotification')
  const id = req.originalUrl.split('?id=')[1]
  const user = req.user
  if (id !== null && id !== undefined && id !== "") user.notifications.splice(id,1)
  else if (id === null || id === undefined || id === "") user.notifications = []
  User.findOneAndUpdate({ '_id': user._id },
    { 'notifications': user.notifications })
    .exec()
  res.json(user.notifications)
}
