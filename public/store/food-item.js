import union from 'lodash/union';
import difference from 'lodash/difference';
import {denormalize} from 'normalizr';

import {foodItem, arrayOfFoodItems} from './schemas';
import {CALL_API} from '../middleware/api';
import {LOAD_FOODS_SUCCESS} from './food-category';

export const SAVE_FOOD_ITEM_REQUEST = 'foodItem/SAVE_FOOD_ITEM_REQUEST';
export const SAVE_FOOD_ITEM_SUCCESS = 'foodItem/SAVE_FOOD_ITEM_SUCCESS';
export const SAVE_FOOD_ITEM_FAILURE = 'foodItem/SAVE_FOOD_ITEM_FAILURE';
export const DELETE_FOOD_ITEM_REQUEST = 'foodItem/DELETE_FOOD_ITEM_REQUEST';
export const DELETE_FOOD_ITEM_SUCCESS = 'foodItem/DELETE_FOOD_ITEM_SUCCESS';
export const DELETE_FOOD_ITEM_FAILURE = 'foodItem/DELETE_FOOD_ITEM_FAILURE';

export const saveFoodItem = (categoryId, foodItem) => ({
  [CALL_API]: {
    endpoint: foodItem._id ? `admin/foods/${categoryId}/items/${foodItem._id}` : `admin/foods/${categoryId}/items`,
    method: foodItem._id ? 'PUT' : 'POST',
    schema: foodItem,
    types: [SAVE_FOOD_ITEM_REQUEST, SAVE_FOOD_ITEM_SUCCESS, SAVE_FOOD_ITEM_FAILURE]
  }
});

export const deleteFoodItem = (categoryId, foodItemId) => ({
  [CALL_API]: {
    endpoint: `admin/foods/${foodItemId}`,
    method: 'DELETE',
    types: [DELETE_FOOD_ITEM_REQUEST, DELETE_FOOD_ITEM_SUCCESS, DELETE_FOOD_ITEM_FAILURE]
  }
});

export default (state = {
  ids: []
}, action) => {
  switch (action.type) {
    case SAVE_FOOD_ITEM_REQUEST:
    case DELETE_FOOD_ITEM_REQUEST:
      return {
        ...state,
        saving: true,
        saveError: null
      };
    case SAVE_FOOD_ITEM_SUCCESS:
    case DELETE_FOOD_ITEM_SUCCESS:
      const result = Array.isArray(action.response.result) ? action.response.result : [action.response.result];
      return {
        ...state,
        ids: action.type === DELETE_FOOD_SUCCESS ?
                   difference(result, state.ids) :
                   union(result, state.ids),
        saving: false
      };
    case LOAD_FOODS_SUCCESS:
      return {
        ...state,
        ids: Object.keys(action.response.entities.foodItems)
      };
    case SAVE_FOOD_ITEM_FAILURE:
    case DELETE_FOOD_ITEM_FAILURE:
      return {
        ...state,
        saving: false,
        saveError: action.error
      };
    default: return state;
  }
};

export const selectors = {
  getAll(foodItems, entities) {
    return denormalize({foodItems}, {foodItems: arrayOfFoodItems}, entities).foodItems;
  },
  getOne(id, entities) {
    return denormalize({foodItems: id}, {foodItems: foodItem}, entities).foodItems;
  }
}
