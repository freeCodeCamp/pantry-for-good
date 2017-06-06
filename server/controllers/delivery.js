import {difference, values} from 'lodash'

import Customer from '../models/customer'
import Volunteer from '../models/volunteer'
import {getDirections} from '../lib/mapquest-client'

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
          }, {new: true})

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
    }, {new: true})

    res.json({
      customers: [...unassignedCustomers, ...assignedCustomers],
      volunteers: [driver, ...values(updatedDrivers)]
    })
  },
  async hasAuthorization(req, res, next) {
    if (req.user && req.user.roles.find(r => r === 'admin')) return next()
    const volunteer = req.user && await Volunteer.findById(Number(req.user._id))
    if (!volunteer || !volunteer.driver) {
      return res.status(403).json({
        message: 'User is not authorized'
      })
    }

    next()
  }
}
