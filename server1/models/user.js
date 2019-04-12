import crypto from 'crypto'
import {values} from 'lodash'
import mongoose from 'mongoose'
import autoIncrement from 'mongoose-plugin-autoinc'

import {ADMIN_ROLE, clientRoles, volunteerRoles, modelTypes} from '../../common/constants'
import {notificationSchema} from './notification'

const Schema = mongoose.Schema

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function(property) {
  return ((this.provider !== 'local' && !this.updated) || property.length)
}

/**
 * A Validation function for local strategy password
 */
var validateLocalStrategyPassword = function(password) {
  return (this.provider !== 'local' || (password && password.length > 6))
}

/**
 * User Schema
 */
const UserSchema = new Schema({
  firstName: {
    type: String,
    trim: true,
    default: '',
    validate: [validateLocalStrategyProperty, 'Please fill in your first name']
  },
  lastName: {
    type: String,
    trim: true,
    default: '',
    validate: [validateLocalStrategyProperty, 'Please fill in your last name']
  },
  displayName: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    validate: [validateLocalStrategyProperty, 'Please fill in your email'],
    match: [/.+@.+\..+/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    default: '',
    select: false,
    validate: [validateLocalStrategyPassword, 'Password should be longer']
  },
  salt: {
    type: String,
    select: false
  },
  provider: {
    type: String,
    required: 'Provider is required'
  },
  google: {},
  roles: [{
    type: String,
    enum: [ADMIN_ROLE, ...values(clientRoles), ...values(volunteerRoles)]
  }],
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  },
  /* For reset password */
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  /* For notifications */
  notifications: [notificationSchema]
})

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function(next) {
  if (this.password && this.password.length > 6) {
    this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64')
    this.password = this.hashPassword(this.password)
  }

  next()
})

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function(password) {
  if (this.salt && password) {
    return crypto.pbkdf2Sync(password, this.salt, 10000, 64, 'sha512').toString('base64')
  } else {
    return password
  }
}

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function(password) {
  return this.password === this.hashPassword(password)
}

/**
 * Schema plugins
 */
UserSchema.plugin(autoIncrement, {
  model: modelTypes.USER,
  startAt: 10000
})

export default mongoose.model(modelTypes.USER, UserSchema)
