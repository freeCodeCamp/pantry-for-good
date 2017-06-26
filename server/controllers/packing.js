import moment from 'moment'
import Package from '../models/package'
import Customer from '../models/customer'
import Food from '../models/food'

const beginWeek = moment.utc().startOf('isoWeek')

export default {
  list: function(req, res, next) {
    Package.find()
    .then(data => res.json(data))
    .catch(err => next(err))
  },
  pack: async function(req, res, next) {
    const {customers, items} = req.body
    try {
      const updatedCustomers = await Promise.all(
        customers.map(async customer =>
          Customer.findByIdAndUpdate(Number(customer.id), {
            lastPacked: beginWeek,
          }, {new: true})
        )
      )

      const updatedItems = await Promise.all(
        items.map(async item => {
          const category = await Food.findOneAndUpdate(
            {'items._id': item._id},
            {$set: {'items.$': item}},
            {new: true}
          )

          if (!category.items) return
          return category.items.find(it => it._id.toString() === item._id)
        })
      )

      const newPackages = await Promise.all(
        customers.map(customer => {
          const contents = customer.packingList.map(item => ({_id: item._id, name: item.name}))
          return Package.create({customer: customer.id, contents})
        })
      )

      res.json({
        customers: updatedCustomers,
        foodItems: updatedItems,
        packages: newPackages
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
    if (req.user && req.user.roles.find(r =>
        r === 'admin' || r === 'volunteer')) {
      return next()
    }
    return res.status(403).json({
      message: 'User is not authorized'
    })
  }
}
