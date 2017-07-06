import {intersection} from 'lodash'
import moment from 'moment'

import {ForbiddenError} from '../lib/errors'
import {ADMIN_ROLE, volunteerRoles} from '../../common/constants'
import Customer from '../models/customer'
import Food from '../models/food'
import Package from '../models/package'

const beginWeek = moment.utc().startOf('isoWeek')

export default {
  list: function(req, res) {
    Package.find()
    .then(data => res.json(data))
  },
  pack: async function(req, res) {
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
  },
  deliver: async function(req, res) {
    const {customerIds} = req.body
    const customers = await Promise.all(
      customerIds.map(async id =>
        Customer.findByIdAndUpdate(id,
          {lastDelivered: beginWeek}, {new: true}))
    )
    res.json({customers})
  },
  hasAuthorization(req, res, next) {
    const authorizedRoles = [
      ADMIN_ROLE,
      volunteerRoles.PACKING
    ]
    if (req.user && intersection(req.user.roles, authorizedRoles).length) {
      return next()
    }

    throw new ForbiddenError
  }
}
