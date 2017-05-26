import {denormalize} from 'normalizr'
import {createSelector} from 'reselect'
import {difference, get, union} from 'lodash'

import {
  foodCategory as foodCategorySchema,
  foodItem as foodItemSchema,
  arrayOfFoodItems
} from '../../../store/schemas'
import {CALL_API} from '../../../store/middleware/api'
import {actions as foodCategoryActions} from './category'
import {crudActions} from '../../../store/utils'

export const actions = crudActions('foodItem')
export const CLEAR_FLAGS = 'foodItem/CLEAR_FLAGS'

export const clearFlags = () => ({type: CLEAR_FLAGS})

export const saveFoodItem = (categoryId, foodItem) => {
  return {
    [CALL_API]: {
      endpoint: foodItem._id ? `admin/foods/${categoryId}/items/${foodItem._id}` : `admin/foods/${categoryId}/items`,
      method: foodItem._id ? 'PUT' : 'POST',
      body: foodItem,
      schema: foodItemSchema,
      responseSchema: foodCategorySchema,
      types: [actions.SAVE_REQUEST, actions.SAVE_SUCCESS, actions.SAVE_FAILURE]
    }
  }
}

export const deleteFoodItem = (categoryId, foodItemId) => ({
  [CALL_API]: {
    endpoint: `admin/foods/${categoryId}/items/${foodItemId}`,
    method: 'DELETE',
    responseSchema: foodCategorySchema,
    types: [actions.DELETE_REQUEST, actions.DELETE_SUCCESS, actions.DELETE_FAILURE]
  }
})

export default (state = {
  ids: []
}, action) => {
  switch (action.type) {
    case actions.SAVE_REQUEST:
    case actions.DELETE_REQUEST:
      return {
        ...state,
        saving: true,
        saveError: null
      }
    case actions.SAVE_SUCCESS:
    case actions.DELETE_SUCCESS: {
      // save (and delete?) returns the whole updated food category
      const result = action.response.entities.foodItems ? Object.keys(action.response.entities.foodItems) : []

      return {
        ...state,
        ids: action.type === actions.DELETE_SUCCESS ?
                              difference(state.ids, result) :
                              union(state.ids, result),
        saving: false
      }
    }
    case foodCategoryActions.LOAD_ALL_SUCCESS:
      return {
        ...state,
        ids: action.response.entities.foodItems ?
              Object.keys(action.response.entities.foodItems) : []
      }
    case actions.SAVE_FAILURE:
    case actions.DELETE_FAILURE:
      return {
        ...state,
        saving: false,
        saveError: action.error
      }
    case CLEAR_FLAGS:
      return {
        ...state,
        saving: false,
        saveError: null,
      }
    default: return state
  }
}

export const createSelectors = path => {
  const getEntities = state => state.entities

  return {
    getAll: createSelector(
      state => get(state, path).ids,
      getEntities,
      (foodItems, entities) =>
        denormalize({foodItems}, {foodItems: arrayOfFoodItems}, entities).foodItems
    ),
    getOne: state => id => createSelector(
      getEntities,
      entities =>
        denormalize({foodItems: id}, {foodItems: foodItemSchema}, entities).foodItems
    )(state),
    saving: state => get(state, path).saving,
    saveError: state => get(state, path).saveError
  }
}
