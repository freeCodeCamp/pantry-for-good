import moment from 'moment'
import Customer from '../models/customer'
import Food from '../models/food'
// const Customer = mongoose.model('Customer');
// const Food = mongoose.model('Food');
const beginWeek = moment.utc().startOf('isoWeek')

export default {
  pack: async function(req, res, next) {
    const {customers, items} = req.body
    try {
      const updatedCustomers = await Promise.all(
        customers.map(async customer =>
          Customer.findByIdAndUpdate(Number(customer.id), {
            lastPacked: beginWeek,
            packingList: customer.packingList.map(item => item._id)
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

      res.json({
        customers: updatedCustomers,
        items: updatedItems
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
  }
}
