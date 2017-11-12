import {denormalize} from 'normalizr'
import {createSelector} from 'reselect'
import {difference, get, union} from 'lodash'
import {utc} from 'moment'
import 'moment-recur'

import {
  foodCategory as foodCategorySchema,
  foodItem as foodItemSchema,
  arrayOfFoodItems
} from '../../../../common/schemas'
import {CALL_API} from '../../../store/middleware/api'
import {actions as foodCategoryActions} from './category'
import {crudActions} from '../../../store/utils'

export const actions = crudActions('foodItem')
export const CLEAR_FLAGS = 'foodItem/CLEAR_FLAGS'

export const clearFlags = () => ({type: CLEAR_FLAGS})

export const saveFoodItem = (categoryId, foodItem) => ({
  [CALL_API]: {
    endpoint: foodItem._id ? `foods/${categoryId}/items/${foodItem._id}` : `foods/${categoryId}/items`,
    method: foodItem._id ? 'PUT' : 'POST',
    body: foodItem,
    schema: foodItemSchema,
    responseSchema: foodCategorySchema,
    types: [actions.SAVE_REQUEST, actions.SAVE_SUCCESS, actions.SAVE_FAILURE]
  }
})

export const deleteFoodItem = (categoryId, foodItemId) => ({
  [CALL_API]: {
    endpoint: `foods/${categoryId}/items/${foodItemId}`,
    method: 'DELETE',
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
    case actions.SAVE_SUCCESS: {
      // save returns the whole updated food category
      const result = action.response.entities.foodItems ? Object.keys(action.response.entities.foodItems) : []
      return {
        ...state,
        ids: union(state.ids, result),
        saving: false
      }
    }
    case actions.DELETE_SUCCESS: {
      return {
        ...state,
        ids: difference(state.ids, [action.response.deletedItemId]),
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
  const getAll = createSelector(
    state => get(state, path).ids,
    getEntities,
    (foodItems, entities) =>
      denormalize({foodItems}, {foodItems: arrayOfFoodItems}, entities).foodItems.filter(item => !item.deleted)
  )

  return {
    getAll,
    getOne: state => id => createSelector(
      getEntities,
      entities =>
        denormalize({foodItems: id}, {foodItems: foodItemSchema}, entities).foodItems
    )(state),
    getScheduled: createSelector(
      getAll,
      items => items.filter(i =>
        i.frequency && utc(i.startDate).recur().every(i.frequency).weeks()
          .matches(utc().startOf('isoWeek')))
    ),
    saving: state => get(state, path).saving,
    saveError: state => get(state, path).saveError
  }
}
