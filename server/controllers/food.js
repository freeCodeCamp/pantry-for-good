import {extend, intersection} from 'lodash'

import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  ValidationError
} from '../lib/errors'
import {ADMIN_ROLE, volunteerRoles} from '../../common/constants'
import Customer from '../models/customer'
import Food from '../models/food'

const {INVENTORY, SCHEDULE} = volunteerRoles

export default {
  /**
   * Create a Food category
   */
  async create(req, res) {
    authorizeByRole(req.user.roles, [INVENTORY])

    const food = new Food(req.body)

    const existingFoodCategory = await Food.find({'category': food.category, 'deleted': false}).lean()

    if (existingFoodCategory.length) {
      throw new ValidationError(['category'], 'That category already exists' )
    }

    const savedFood = await food.save()
    res.json(savedFood)
  },

  /**
   * Update a Food category
   */
  async update(req, res) {
    authorizeByRole(req.user.roles, [INVENTORY])

    const food = extend(req.food, req.body)

    const savedFood = await food.save()
    res.json(savedFood)
  },

  /**
   * Delete a Food category
   */
  async delete(req, res) {
    authorizeByRole(req.user.roles, [INVENTORY])

    const food = req.food

    // Prevent deleting if food category contains food items not marked as deleted
    if (food.items.filter(item => !item.deleted).length) {
      throw new BadRequestError('Food category must be empty before deleting')
    }

    // If the category has items then mark it as deleted instead of deleting from the database
    if (food.items.length) {
      await Food.findByIdAndUpdate(food._id, {deleted: true})
    } else {
      await food.remove()
    }
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
    authorizeByRole(req.user.roles, [INVENTORY])

    const item = req.body
    item.name = item.name.trim()

    //Check to see if an item with the same name already exists in a category
    let categoryWithExistingItem = await Food.findOne(
      { items: {$elemMatch:{name: {$regex: `^${item.name}$`, $options: "i"}, deleted: false }} },
      { 'items.$': 1 }
    ).lean()

    if (categoryWithExistingItem) {
      const existingFoodItem = categoryWithExistingItem.items[0]
      existingFoodItem.categoryId = item.categoryId
      existingFoodItem.quantity += Number(item.quantity)

      const updatedCategory = await updateItemHelper(categoryWithExistingItem._id, existingFoodItem)
      res.json(updatedCategory)
    } else {
      const savedFood = await Food.findByIdAndUpdate(req.food._id, { $addToSet: { items: item } }, { new: true })
      res.json(savedFood)

      // Add item to every customer's food preferences
      // TODO: do we want this?
      await Customer.update({}, { $addToSet: { foodPreferences: item._id } }, { multi: true })
    }
  },

  /**
   * Update a food item
   */
  async updateItem(req, res) {
    authorizeByRole(req.user.roles, [INVENTORY, SCHEDULE])

    const originalCategoryId = req.params.foodId
    const updatedItem = req.body

    const involvesCategoryChange = !updatedItem.categoryId || updatedItem.categoryId === originalCategoryId
    if (involvesCategoryChange) authorizeByRole(req.user.roles, [INVENTORY])

    const updatedCategory = await updateItemHelper(originalCategoryId, updatedItem)
    res.json(updatedCategory)
  },

  /**
   * Delete a food item
   */
  async deleteItem(req, res) {
    authorizeByRole(req.user.roles, [INVENTORY])

    const categoryId = req.food._id
    const foodItemId = req.itemId
    await Food.update({"_id": categoryId, "items._id": foodItemId}, { $set: {"items.$.deleted": true} })

    // Delete the food item from customer preferences
    await Customer.update({}, { $pull: { "foodPreferences": foodItemId } }, {multi: true})

    res.json({deletedItemId: req.itemId})
  },

  /**
   * Food middleware
   */
  async foodById(req, res, next, id) {
    const food = await Food.findById(id)

    if (!food) throw new NotFoundError

    req.food = food
    next()
  },

  itemById(req, res, next, id) {
    req.itemId = id
    next()
  }
}

function authorizeByRole(userRoles, roles = []) {
  if (!intersection(userRoles, [...roles, ADMIN_ROLE]).length) {
    throw new ForbiddenError
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

async function updateFoodItemWithCategoryChange(originalCategoryId, updatedItem) {
  // delete from old category
  await Food.findByIdAndUpdate(originalCategoryId, {
    $pull: { items: { _id: updatedItem._id } } })

  // add to new
  return Food.findByIdAndUpdate(updatedItem.categoryId,
    { $addToSet: { items: updatedItem } },
    { new: true }
  )
}
