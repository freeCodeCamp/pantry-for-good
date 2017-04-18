import extend from 'lodash/extend'

import Food from '../models/food'
import Customer from '../models/customer'

export default {
  /**
   * Create a Food category
   */
  async create(req, res) {
    const food = new Food(req.body)

    const savedFood = await food.save()
    res.json(savedFood)
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
    const id = req.food._id
    const item = req.body

    const savedFood = await Food.findByIdAndUpdate(id,
        {$addToSet: {items: item}}, {new: true})

    // Add item to every customer's food preferences
    // TODO: test this
    await Customer.update({}, {$addToSet: {foodPreferences: item._id}}, {multi: true})

    res.json(savedFood)
  },

  /**
   * Update a food item
   */
  async updateItem(req, res) {
    const foodItemId = req.params.itemId
    const orginalCategoryId = req.params.foodId
    const updatedItem = req.body
    let savedFood    
    if (updatedItem.categoryId === orginalCategoryId) {
      // same food category so just update the item in that category
      savedFood = await Food.findOneAndUpdate(
        { _id: orginalCategoryId, 'items._id': foodItemId },
        { $set: { 'items.$': updatedItem } },
        { new: true }
      )
    } else {
      // new food category so need to delete from old category items and add to new category items
      const deletedFoodCategory = await Food.findByIdAndUpdate(
        orginalCategoryId, 
        { $pull: { items: { _id: foodItemId } } },
        { new: true }
      )
      if (!deletedFoodCategory) {
        return res.status(500).json({error: 'Database error removing foodItem from original category'})
      }
      savedFood = await Food.findByIdAndUpdate(
        updatedItem.categoryId,
        { $addToSet: { items: updatedItem } },
        { new: true }
      )
    }

    res.json(savedFood)
  },

  /**
   * Delete a food item
   */
  async deleteItem(req, res) {
    const id = req.food._id

    const savedFood = await Food.findByIdAndUpdate(
      id,
      {$pull: {items: {_id: req.itemId}}},
    ).lean()

    const deletedItem = savedFood.items.filter(item =>
      item._id.toString() === req.itemId)

    res.json({
      ...savedFood,
      items: deletedItem
    })
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
  }
}
