import {extend, intersection, includes, omit} from 'lodash'

import {ForbiddenError, NotFoundError} from '../lib/errors'
import {ADMIN_ROLE, clientRoles, volunteerRoles, customerStatus} from '../../common/constants'
import Customer from '../models/customer'
import Volunteer from '../models/volunteer'
import Package from '../models/package'
import mailer from '../lib/mail/mail-helpers'
import User from '../models/user'

import {updateFields} from '../lib/update-linked-fields'
import {searchUserAndSetNotification, searchVolunteerAndSetNotification} from '../lib/notification-sender'

export default {
  /**
   * Create a customer
   */
  async create(req, res) {
    let customer = new Customer(omit(req.body, ['status']))
    customer._id = req.user.id

    await User.findOneAndUpdate(
      {_id: customer._id},
      {$push: {roles: clientRoles.CUSTOMER}}
    )

    // Sent Notification
    searchUserAndSetNotification('roles/admin', {message:`Customer ${customer.fullName} was created!`, url: `/customers/${customer._id}`}, req.user._id)

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

    // Check if status is updated by admin
    if (oldCustomer.status === 'Pending' && (newCustomer.status === 'Accepted' || newCustomer.status === 'Rejected')) {
      mailer.sendStatus(newCustomer)
    // Check if status was updated by someone else than the user
    } else if(!(newCustomer.status === 'Away' || newCustomer.status === 'Available' )){
      mailer.sendUpdate(newCustomer)
    }

    // Sent Notification
    searchUserAndSetNotification('roles/admin', {message:`Customer ${customer.fullName} was updated!`, url: `/customers/${customer._id}`}, req.user._id)
    searchVolunteerAndSetNotification({message:`Customer ${customer.fullName} was updated!`, url: `/customers/${customer._id}`}, customer._id)

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

    // Check to see if the customer is associated with any packages
    const packageCount = await Package.find({customer: id}).count()

    if (packageCount > 0) {
      // Don't delete the customer since a package references its data
      res.status(409).json({message: "This customer has packages and can't be deleted"})
    } else {
      // Remove the customer if it occurs in any Volunteers.customers
      await Volunteer.update({}, { $pull: { "customers": id } }, {multi: true})

      await Customer.findByIdAndRemove(id)
      res.json(req.customer)
    }
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
