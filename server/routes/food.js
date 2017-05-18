import Router from 'express-promise-router'

import foodController from '../controllers/food'
import * as userController from '../controllers/users'

export default () => {
  const {requiresLogin} = userController

  const foodRouter = Router({mergeParams: true})

  // TODO: protect these!
  foodRouter.route('/admin/foods')
    .get(foodController.list)
    .post(foodController.create)
  foodRouter.route('/admin/foods/:foodId')
    .put(foodController.update)
    .delete(foodController.delete)
  foodRouter.route('/admin/foods/:foodId/items')
    .post(foodController.createItem)
  foodRouter.route('/admin/foods/:foodId/items/:itemId')
    .put(foodController.updateItem)
    .delete(foodController.deleteItem)

  // Food routes for user
  foodRouter.route('/foods')
    .get(requiresLogin, foodController.list)

  // Finish by binding the food middleware
  foodRouter.param('foodId', foodController.foodById)
  foodRouter.param('itemId', foodController.itemById)

  return foodRouter
}
