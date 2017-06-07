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

  foodRouter.route('/foods')
    .get(requiresLogin, foodController.list)
    .post(foodController.hasAuthorization, websocketMiddleware(saveCatSchema), foodController.create)
  foodRouter.route('/foods/:foodId')
    .put(foodController.hasAuthorization, websocketMiddleware(saveCatSchema), foodController.update)
    .delete(foodController.hasAuthorization, websocketMiddleware(deleteCatSchema), foodController.delete)
  foodRouter.route('/foods/:foodId/items')
    .post(foodController.hasAuthorization, websocketMiddleware(saveItemSchema), foodController.createItem)
  foodRouter.route('/foods/:foodId/items/:itemId')
    .put(foodController.hasAuthorization, websocketMiddleware(saveItemSchema), foodController.updateItem)
    .delete(foodController.hasAuthorization, websocketMiddleware(deleteItemSchema), foodController.deleteItem)

  // Finish by binding the food middleware
  foodRouter.param('foodId', foodController.foodById)
  foodRouter.param('itemId', foodController.itemById)

  return foodRouter
}
