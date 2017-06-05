import extend from 'lodash/extend'

import Food from '../models/food'
import Customer from '../models/customer'

export default {
  /**
   * Create a Food category
   */
  async create(req, res) {
    const food = new Food(req.body)

    try {
      const savedFood = await food.save()
      res.json(savedFood)
    } catch (error) {
      // Check if it is a unique key error(11000) from the category field
      if (error.code === 11000 && error.errmsg.match('category')) {
        const response = {
          name: 'Duplicate category error',
          message: 'That category already exists',
          errors: {category: {message: 'That category already exists'}}
        }
        return res.status(400).json({error: response})
      } else {
        return res.status(500).json(error)
      }
    }
  },

  /**
   * Update a Food category
   */
  async update(req, res) {
    const food = extend(req.food, req.body)

    const savedFood = await food.save()
    res.json(savedFood)
  },

  /**
   * Delete a Food category
   */
  async delete(req, res) {
    const food = req.food

    // Prevent remove if food category contains food items
    if (food.items.length) {
      return res.status(400).json({
        message: 'Food category must be empty before deleting'
      })
    }

    await food.remove()
    res.json(food)
  },

  /**
   * List of Food categories
   */
  async list(req, res) {
    const foods = await Food.find()
      .sort('category')

    res.json(foods)
  },

  /**
   * Create a food item
   */
  async createItem(req, res) {
    const item = req.body
    item.name = item.name.trim()

    //Check to see if an item with the same name already exists in a category
    let categoryWithExistingItem = await Food.findOne({ 'items.name': { $regex: `^${item.name}$`, $options: "i" } }, { 'items.$': 1 }).lean()

    if (categoryWithExistingItem) {
      const existingFoodItem = categoryWithExistingItem.items[0]
      existingFoodItem.categoryId = item.categoryId
      existingFoodItem.quantity += Number(item.quantity)

      try {
        const updatedCategory = await updateItemHelper(categoryWithExistingItem._id, existingFoodItem)
        res.json(updatedCategory)
      } catch (err) {
        res.status(500).json({ error: err.message })
      }
    } else {
      try {
        const savedFood = await Food.findByIdAndUpdate(req.food._id, { $addToSet: { items: item } }, { new: true })
        res.json(savedFood)
      } catch (err) {
        res.status(500).json({ error: err.message })
      }

      // Add item to every customer's food preferences
      // TODO: test this
      await Customer.update({}, { $addToSet: { foodPreferences: item._id } }, { multi: true })
    }
  },

  /**
   * Update a food item
   */
  async updateItem(req, res) {
    const originalCategoryId = req.params.foodId
    const updatedItem = req.body

    try {
      const updatedCategory = await updateItemHelper(originalCategoryId, updatedItem)
      res.json(updatedCategory)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  /**
   * Delete a food item
   */
  async deleteItem(req, res) {
    const categoryId = req.food._id
    const foodItemId = req.itemId
    await Food.findByIdAndUpdate(categoryId, { $pull: { items: { _id: foodItemId } } })
    res.json({deletedItemId: req.itemId})
  },

  /**
   * Food middleware
   */
  async foodById(req, res, next, id) {
    const food = await Food.findById(id)

    if (!food) return res.status(404).json({
      message: 'Not found'
    })

    req.food = food
    next()
  },

  itemById(req, res, next, id) {
    req.itemId = id
    next()
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

/**
 * Common functionality used by createItem and UpdateItem to update a food item
 */
function updateItemHelper(originalCategoryId, updatedItem) {
  if (!updatedItem.categoryId || updatedItem.categoryId === originalCategoryId) {
    return updateFoodItemWithoutCategoryChange(originalCategoryId, updatedItem)
  } else {
    return updateFoodItemWithCategoryChange(originalCategoryId, updatedItem)
  }
}

function updateFoodItemWithoutCategoryChange(categoryId, updatedItem) {
  // same food category so just update the item in that category
  return Food.findOneAndUpdate(
    { _id: categoryId, 'items._id': updatedItem._id },
    { $set: { 'items.$': updatedItem } },
    { new: true }
  )
}

function updateFoodItemWithCategoryChange(originalCategoryId, updatedItem) {
  return new Promise((resolve, reject) => {
    // first delete from the old category items colletion with $pull
    Food.findByIdAndUpdate(originalCategoryId, { $pull: { items: { _id: updatedItem._id } } }, { new: true })
    .catch(() => {
      reject(new Error('Database error removing foodItem from original category'))
    })
    .then(() => {
      // Add the item to the new category items collection
      Food.findByIdAndUpdate(updatedItem.categoryId, { $addToSet: { items: updatedItem } }, { new: true })
      .then(result => {
        if (result) {
          resolve(result)
        } else {
          reject(new Error('Could not update database'))
        }
      })
      .catch(err => reject(err))
    })
  })
}
