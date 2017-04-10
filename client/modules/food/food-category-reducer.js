import {denormalize} from 'normalizr'

import {foodCategory, arrayOfFoodCategories} from '../../store/schemas'
import {CALL_API} from '../../store/middleware/api'
import {crudActions, crudReducer} from '../../store/utils'

export const actions = crudActions('foodCategory')

export const loadFoods = () => ({
  [CALL_API]: {
    endpoint: 'foods',
    schema: arrayOfFoodCategories,
    types: [actions.LOAD_ALL_REQUEST, actions.LOAD_ALL_SUCCESS, actions.LOAD_ALL_FAILURE]
  }
})

export const saveFood = food => ({
  [CALL_API]: {
    endpoint: food._id ? `admin/foods/${food._id}` : `admin/foods`,
    method: food._id ? 'PUT' : 'POST',
    body: food,
    schema: foodCategory,
    types: [actions.SAVE_REQUEST, actions.SAVE_SUCCESS, actions.SAVE_FAILURE]
  }
})

export const deleteFood = id => ({
  [CALL_API]: {
    endpoint: `admin/foods/${id}`,
    method: 'DELETE',
    schema: foodCategory,
    types: [actions.DELETE_REQUEST, actions.DELETE_SUCCESS, actions.DELETE_FAILURE]
  }
})

export default crudReducer('foodCategory')

export const selectors = {
  getAll(foodCategories, entities) {
    return denormalize({foodCategories}, {foodCategories: arrayOfFoodCategories}, entities).foodCategories
  },
  getOne(id, entities) {
    return denormalize({foodCategories: id}, {foodCategories: foodCategory}, entities).foodCategories
  },
  loading(foodCategory) {
    return foodCategory.fetching
  },
  loadError(foodCategory) {
    return foodCategory.fetchError
  }
}
