import Router from 'express-promise-router'

import foodController from '../controllers/food'
import * as userController from '../controllers/users'
import websocketMiddleware from '../lib/websocket-middleware'
import {foodCategory} from '../../common/schemas'

const sync = {
  syncTo: ['volunteer'],
  schema: foodCategory
}

const saveCatSchema = {...sync, type: 'foodCategory/SAVE_SUCCESS'}
const deleteCatSchema = {...sync, type: 'foodCategory/DELETE_SUCCESS'}
const saveItemSchema = {...sync, type: 'foodItem/SAVE_SUCCESS'}
const deleteItemSchema = {syncTo: ['volunteer'], type: 'foodItem/DELETE_SUCCESS'}

export default () => {
  const {requiresLogin} = userController

  const foodRouter = Router({mergeParams: true})

  foodRouter.route('/admin/foods')
    .get(foodController.list)
    .post(websocketMiddleware(saveCatSchema), foodController.create)
  foodRouter.route('/admin/foods/:foodId')
    .put(websocketMiddleware(saveCatSchema), foodController.update)
    .delete(websocketMiddleware(deleteCatSchema), foodController.delete)
  foodRouter.route('/admin/foods/:foodId/items')
    .post(websocketMiddleware(saveItemSchema), foodController.createItem)
  foodRouter.route('/admin/foods/:foodId/items/:itemId')
    .put(websocketMiddleware(saveItemSchema), foodController.updateItem)
    .delete(websocketMiddleware(deleteItemSchema), foodController.deleteItem)

  // Food routes for user
  foodRouter.route('/foods')
    .get(requiresLogin, foodController.list)

  // Finish by binding the food middleware
  foodRouter.param('foodId', foodController.foodById)
  foodRouter.param('itemId', foodController.itemById)

  return foodRouter
}
