import {extend, intersection, includes} from 'lodash'

import {ForbiddenError, NotFoundError} from '../lib/errors'
import {ADMIN_ROLE, clientRoles, volunteerRoles, customerStatus} from '../../common/constants'
import Customer from '../models/customer'
import mailer from '../lib/mail/mail-helpers'
import User from '../models/user'
import {updateFields} from '../lib/update-linked-fields'


export default {
  /**
   * Create a customer
   */
  async create(req, res) {
    let customer = new Customer(req.body)
    customer._id = req.user.id

    await User.findOneAndUpdate(
      {_id: customer._id},
      {$push: {roles: clientRoles.CUSTOMER}}
    )

    const savedCustomer = await customer.save()
    updateFields(clientRoles.CUSTOMER, req.body.fields, customer._id)
    res.json(savedCustomer)

    // mailer.send(config.mailer.to, 'A new client has applied.', 'create-customer-email')
  },

  /**
   * Show the current customer
   */
  read(req, res) {
    res.json(req.customer)
  },

  /**
   * Update a customer
   */
  async update(req, res) {
    const customer = extend(req.customer, req.body)

    const oldCustomer = await Customer.findById(customer._id)
    const newCustomer = await customer.save()

    if (newCustomer.status !== oldCustomer.status) {
      mailer.sendStatus(newCustomer)
    } else {
      mailer.sendUpdate(newCustomer)
    }
    updateFields(clientRoles.CUSTOMER, req.body.fields, customer._id)
    res.json(newCustomer)
  },

  /**
   * List customers
   */
  async list(req, res) {
    const customers = await Customer.find()
      .sort('-dateReceived')
      .populate('user', 'displayName')
      .populate('assignedTo', 'firstName lastName')
    res.json(customers)
  },

  /**
   * Delete customer
   */
  async delete(req, res) {
    const id = req.customer._id

    await User.findByIdAndRemove(id)
    await Customer.findByIdAndRemove(id)

    res.json(req.customer)
  },
  /**
   * Customer middleware
   */
  async customerById(req, res, next, id) {
    const customer = await Customer.findById(id)

    if (!customer) throw new NotFoundError

    req.customer = customer
    next()
  },

  /**
   * Customer authorization middleware
   */
  hasAuthorization(req, res, next) {
    const authorizedRoles = [
      ADMIN_ROLE,
      volunteerRoles.DRIVER,
      volunteerRoles.PACKING
    ]

    if (req.user && intersection(req.user.roles, authorizedRoles).length) {
      return next()
    }

    if (!req.customer || req.customer._id !== +req.user.id)
      throw new ForbiddenError

    next()
  },

  /**
   * Customer Middleware
   */
  async canChangeStatus(req, res, next) {
    const unrestrictedRoles = [
      ADMIN_ROLE,
    ]
    const restrictedStatus = [
      customerStatus.REJECTED,
      customerStatus.PENDING,
    ]

    if (req.user && !intersection(req.user.roles, unrestrictedRoles).length) {
      const statusChanged = req.customer.status !== req.body.status
      if (statusChanged && includes(restrictedStatus, req.customer.status))
        throw new ForbiddenError
    }

    next()
  }
}
