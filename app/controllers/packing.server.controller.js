import mongoose from 'mongoose';

const Customer = mongoose.model('Customer');
const Food = mongoose.model('Food');

export default {
  pack: async function(req, res, next) {
    const {customerIds, items, beginWeek} = req.body;

    try {
      const updatedCustomers = await Promise.all(
        customerIds.map(async id =>
          Customer.findByIdAndUpdate(id,
            {lastPacked: beginWeek}, {new: true})
        )
      );

      const updatedItems = await Promise.all(
        items.map(async item => {
          const category = await Food.findOneAndUpdate({'items._id': item._id},
            {$set: {'items.$': item}}, {new: true});

          if (!category.items) return;
          return category.items.find(it => it._id.toString() === item._id);
        })
      );

      res.json({
        customers: updatedCustomers,
        items: updatedItems
      });
    } catch (err) {
      next(err);
    }
  }
};
