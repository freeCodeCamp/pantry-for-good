import {difference, intersection, values} from 'lodash'

import {ForbiddenError} from '../lib/errors'
import {getDirections} from '../lib/mapquest-client'
import {ADMIN_ROLE, volunteerRoles} from '../../common/constants'
import Customer from '../models/customer'
import Volunteer from '../models/volunteer'


export default {
  async directions(req, res) {
    const directions = await getDirections(req.query.waypoints, {
      optimize: req.query.optimize
    })

    res.json(directions)
  },
  async assign(req, res) {
    const customerIds = req.body.customerIds.map(id => Number(id))
    const driverId = Number(req.body.driverId)

    let updatedDrivers = {}
    const previousAssigned = (await Volunteer.findById(driverId)).customers

    // unassign customers that were deselected
    const unassignedCustomers = await Promise.all(
      difference(previousAssigned, customerIds).map(id =>
        Customer.findByIdAndUpdate(id, {$set: {assignedTo: null}}, {new: true}))
    )

    // assign selected customers
    const assignedCustomers = await Promise.all(
      customerIds.map(async id => {
        const assignedTo = (await Customer.findById(id)).assignedTo

        if (assignedTo && assignedTo !== driverId) {
          // customer was assigned to another driver, remove from old driver
          const updatedDriver = await Volunteer.findByIdAndUpdate(assignedTo, {
            $pull: {customers: id}
          }, {new: true}).populate('user', 'roles')

          updatedDrivers[assignedTo] = updatedDriver
        }
        return Customer.findByIdAndUpdate(id, {
          $set: {assignedTo: driverId}}, {new: true})
      })
    )

    const driver = await Volunteer.findByIdAndUpdate(driverId, {
      $set: {
        customers: customerIds,
        optimized: false
      }
    }, {new: true}).populate('user', 'roles')

    res.json({
      customers: [...unassignedCustomers, ...assignedCustomers],
      volunteers: [driver, ...values(updatedDrivers)]
    })
  },
  async hasAuthorization(req, res, next) {
    const authorizedRoles = [
      ADMIN_ROLE,
      volunteerRoles.DRIVER
    ]

    if (req.user && intersection(req.user.roles, authorizedRoles).length) {
      return next()
    } else {
      throw new ForbiddenError
    }
  }
}
