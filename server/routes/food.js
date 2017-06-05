import Router from 'express-promise-router'

import foodController from '../controllers/food'
import * as userController from '../controllers/users'

export default () => {
  const {requiresLogin} = userController

  const foodRouter = Router({mergeParams: true})

  foodRouter.route('/foods')
    .get(requiresLogin, foodController.list)
    .post(foodController.hasAuthorization, foodController.create)
  foodRouter.route('/foods/:foodId')
    .put(foodController.hasAuthorization, foodController.update)
    .delete(foodController.hasAuthorization, foodController.delete)
  foodRouter.route('/foods/:foodId/items')
    .post(foodController.hasAuthorization, foodController.createItem)
  foodRouter.route('/foods/:foodId/items/:itemId')
    .put(foodController.hasAuthorization, foodController.updateItem)
    .delete(foodController.hasAuthorization, foodController.deleteItem)

  // Finish by binding the food middleware
  foodRouter.param('foodId', foodController.foodById)
  foodRouter.param('itemId', foodController.itemById)

  return foodRouter
}
