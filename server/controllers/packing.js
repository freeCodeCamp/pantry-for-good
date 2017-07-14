import {intersection, uniq} from 'lodash'
import moment from 'moment'
import mongoose from 'mongoose'

import {BadRequestError, ForbiddenError} from '../lib/errors'
import {ADMIN_ROLE, volunteerRoles} from '../../common/constants'
import Customer from '../models/customer'
import Food from '../models/food'
import Package from '../models/package'

const beginWeek = moment.utc().startOf('isoWeek')

export default {
  list: function(req, res) {
    Package.find().then(data => res.json(data))
  },

  /**
   * Creates new food packages
   * The req.body post data should be an array of food package objects with the following shape
   * {customer: "10000", contents: ["594d6a4f9431ac26453cef08", "594d6a4f9431ac26453cef0b"]}
   */
  pack: async function(req, res) {
    const packages = req.body
    if (!Array.isArray(packages)) {
      throw new BadRequestError('Request body must be an array')
    }
    const customerIdsToUpdate = []
    const packedItemCounts = {}

    //Iterate through the packages to calculate packedCustomerIds and packedItemCounts
    packages.forEach(customerPackage => {
      validatePackage(customerPackage)
      customerIdsToUpdate.push(customerPackage.customer)
      addPackageContentsToItemCounts(customerPackage.contents, packedItemCounts)
    })
    const foodItemIdsToUpdate = Object.keys(packedItemCounts)

    await Promise.all([
      verifyCustomerIds(customerIdsToUpdate),
      verifyFoodItemIds(foodItemIdsToUpdate)
    ])

    // save the new packages to the database
    const now = new Date().toISOString()
    const newPackages = await Promise.all(
      packages.map(customerPackage => Package.create({
        ...customerPackage,
        datePacked: now,
        packedBy: req.user._id,
        status: 'Packed'
      }))
    )

    //update customers lastPacked field in database
    await Customer.update({ _id: { $in: customerIdsToUpdate } }, { "$set": { lastPacked: now } }, { "multi": true })

    // Create an array of updates to apply to customers
    const customerUpdates = customerIdsToUpdate.map(_id => ({
      _id,
      lastPacked: now
    }))

    // Update the food item inventory quantities
    const foodItemUpdates = []
    await Promise.all(
      foodItemIdsToUpdate.map(itemId =>
        Food.findOneAndUpdate(
          { 'items._id': itemId },
          { $inc: { 'items.$.quantity': -packedItemCounts[itemId] } },
          { new: true }
        ).then(food => {
          const quantity = food.items.find(item => item._id.equals(itemId)).quantity
          foodItemUpdates.push({ _id: itemId, quantity })
        })
      )
    )

    res.json({
      packages: newPackages,
      foodItems: foodItemUpdates,
      customers: customerUpdates
    })
  },

  /**
   * Unpacks a packed food package for a customer.
   * In essence it undoes the pack() function by deleting the package, adding the package contents
   * back to the foodItem counts and updating the customer.lastPacked field.
   * req.body.id must be set to the _id of the package to delete
   */
  unpack: async function (req, res) {
    if (!req.body._id) {
      throw new BadRequestError('package _id must be included in the request')
    }
    if (!mongoose.Types.ObjectId.isValid(req.body._id)) {
      throw new BadRequestError(`${req.body._id} is not a valid package _id`)
    }
    const deletedPackage = await Package.findByIdAndRemove(req.body._id)

    if (!deletedPackage) {
      throw new BadRequestError(`package with _id ${req.body._id} not found`)
    }

    // Have to update the lastPacked date for the customer by finding the latest datePacked package for that customer
    const customersLastPackedPackage =
      await Package.findOne({ customer: deletedPackage.customer }, {}, { sort: { 'datePacked': -1 } }).lean()

    const updatedLastPacked = customersLastPackedPackage ? customersLastPackedPackage.datePacked : null

    await Customer.findByIdAndUpdate(deletedPackage.customer, {lastPacked: updatedLastPacked})

    const updatedItemCounts = []

    // Add the items from the unpacked package back to the inventory counts
    await Promise.all(
      deletedPackage.contents.map(itemId => Food.findOneAndUpdate(
        {'items._id': itemId},
        {$inc:  {'items.$.quantity': 1 }},
        {new: true}
      ).then(foodCategory => {
        // store the updated quantity for this foodItem in updatedItemCounts
        const foodItem = foodCategory.items.find(item => item._id.equals(itemId))
        updatedItemCounts.push({
          _id: foodItem._id,
          quantity: foodItem.quantity
        })
      }))
    )

    res.json({
      packages: deletedPackage,
      foodItems: updatedItemCounts,
      customers: {
        _id: deletedPackage.customer,
        lastPacked: updatedLastPacked
      }
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

// Verify a package object has the required properties customer and contents
function validatePackage(customerPackage) {
  if (!customerPackage.customer) {
    throw new BadRequestError('Customer property must be set on all packages')
  }
  if (!customerPackage.contents || !Array.isArray(customerPackage.contents)) {
    throw new BadRequestError('Each package must have property contents that is an array')
  }
}

// Verify a list of customer Ids exist in the database
async function verifyCustomerIds(customerIds) {
  const count = await Customer.count({ _id: { $in: customerIds } })

  if (count !== uniq(customerIds).length) {
    throw new BadRequestError('One or more customerIds are not valid')
  }

}

// Verify a list of foodItem Ids exist in the database
async function verifyFoodItemIds(foodItemIds) {
  await Promise.all(
    foodItemIds.map(_id => {
      if (!mongoose.Types.ObjectId.isValid(_id)) {
        throw new BadRequestError(`${_id} is not a valid foodItem _id`)
      }
      return Food.count({ 'items._id': _id }).then(count => {
        if (!count) throw new BadRequestError(`foodItem ${_id} was not found in the database`)
      })
    })
  )
}

// Takes an array of foodItem ids and increments packedItemCounts[foodItemId] for each item in contents
function addPackageContentsToItemCounts(contents, packedItemCounts) {
  contents.forEach(foodItemId => {
    if (packedItemCounts[foodItemId]) {
      packedItemCounts[foodItemId] = packedItemCounts[foodItemId] + 1
    } else {
      packedItemCounts[foodItemId] = 1
    }
  })
}
