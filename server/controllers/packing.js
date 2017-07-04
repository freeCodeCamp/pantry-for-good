import {intersection} from 'lodash'
import moment from 'moment'

import {ADMIN_ROLE, volunteerRoles} from '../../common/constants'
import Customer from '../models/customer'
import Food from '../models/food'
import Package from '../models/package'

const beginWeek = moment.utc().startOf('isoWeek')

export default {
  list: function(req, res, next) {
    Package.find()
    .then(data => res.json(data))
    .catch(err => next(err))
  },
  pack: async function(req, res, next) {
    const packages = req.body
    const packedCustomerIds = []
    const packedItemCounts = {}

    //Iterate through the packages to calculate packedCustomerIds and packedItemCounts
    packages.forEach(customerPackage => {
      packedCustomerIds.push(customerPackage.customer)
      customerPackage.contents.forEach(itemId => {
        if (packedItemCounts[itemId]) {
          packedItemCounts[itemId] = packedItemCounts[itemId] + 1
        } else {
          packedItemCounts[itemId] = 1
        }
      })
    })

    try {
      //mark customers as last packed this week
      await Customer.update({_id: {$in: packedCustomerIds}}, {"$set": {lastPacked: beginWeek}}, {"multi": true})

      // Update the food item inventory quantities
      const foodItemIdsToUpdate = Object.keys(packedItemCounts)
      await Promise.all(
        foodItemIdsToUpdate.map(itemId =>
          Food.findOneAndUpdate(
            {'items._id': itemId},
            {$inc:  {'items.$.quantity': -packedItemCounts[itemId] }}
          ).exec()
        )
      )

      const newPackages = await Promise.all(
        packages.map(customerPackage => Package.create(customerPackage))
      )

      res.json({
        packages: newPackages,
        packedCustomerIds,
        packedItemCounts
      })
    } catch (err) {
      next(err)
    }
  },
  deliver: async function(req, res, next) {
    const {customerIds} = req.body
    try {
      const customers = await Promise.all(
        customerIds.map(async id =>
          Customer.findByIdAndUpdate(id,
            {lastDelivered: beginWeek}, {new: true}))
      )
      res.json({customers})
    } catch (err) {
      next(err)
    }
  },
  hasAuthorization(req, res, next) {
    const authorizedRoles = [
      ADMIN_ROLE,
      volunteerRoles.PACKING
    ]
    if (req.user && intersection(req.user.roles, authorizedRoles).length) {
      return next()
    }
    return res.status(403).json({
      message: 'User is not authorized'
    })
  }
}
