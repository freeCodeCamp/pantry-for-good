import union from 'lodash/union';
import difference from 'lodash/difference';
import {denormalize} from 'normalizr';

import {foodCategory, arrayOfFoodCategories} from './schemas';
import {CALL_API} from '../middleware/api';

export const LOAD_FOODS_REQUEST = 'foodCategory/LOAD_FOODS_REQUEST';
export const LOAD_FOODS_SUCCESS = 'foodCategory/LOAD_FOODS_SUCCESS';
export const LOAD_FOODS_FAILURE = 'foodCategory/LOAD_FOODS_FAILURE';
export const SAVE_FOOD_REQUEST = 'foodCategory/SAVE_FOOD_REQUEST';
export const SAVE_FOOD_SUCCESS = 'foodCategory/SAVE_FOOD_SUCCESS';
export const SAVE_FOOD_FAILURE = 'foodCategory/SAVE_FOOD_FAILURE';
export const DELETE_FOOD_REQUEST = 'foodCategory/DELETE_FOOD_REQUEST';
export const DELETE_FOOD_SUCCESS = 'foodCategory/DELETE_FOOD_SUCCESS';
export const DELETE_FOOD_FAILURE = 'foodCategory/DELETE_FOOD_FAILURE';

export const loadFoods = () => ({
  [CALL_API]: {
    endpoint: 'admin/foods',
    schema: arrayOfFoodCategories,
    types: [LOAD_FOODS_REQUEST, LOAD_FOODS_SUCCESS, LOAD_FOODS_FAILURE]
  }
});

export const saveFood = food => ({
  [CALL_API]: {
    endpoint: food._id ? `admin/foods/${food._id}` : `admin/foods`,
    method: food._id ? 'PUT' : 'POST',
    schema: foodCategory,
    types: [SAVE_FOOD_REQUEST, SAVE_FOOD_SUCCESS, SAVE_FOOD_FAILURE]
  }
});

export const deleteFood = id => ({
  [CALL_API]: {
    endpoint: `admin/foods/${id}`,
    method: 'DELETE',
    types: [DELETE_FOOD_REQUEST, DELETE_FOOD_SUCCESS, DELETE_FOOD_FAILURE]
  }
});

export default (state = {
  ids: []
}, action) => {
  switch (action.type) {
    case LOAD_FOODS_REQUEST:
      return {
        ...state,
        fetching: true,
        saving: false,
        fetchError: null,
        saveError: null
      };
    case SAVE_FOOD_REQUEST:
    case DELETE_FOOD_REQUEST:
      return {
        ...state,
        fetching: false,
        saving: true,
        fetchError: null,
        saveError: null
      };
    case LOAD_FOODS_SUCCESS:
    case SAVE_FOOD_SUCCESS:
    case DELETE_FOOD_SUCCESS:
      const result = Array.isArray(action.response.result) ? action.response.result : [action.response.result];
      return {
        ...state,
        ids: action.type === DELETE_FOOD_SUCCESS ?
                   difference(result, state.ids) :
                   union(result, state.ids),
        fetching: false,
        saving: false
      };
    case LOAD_FOODS_FAILURE:
      return {
        ...state,
        fetching: false,
        saving: false,
        fetchError: action.error
      };
    case SAVE_FOOD_FAILURE:
    case DELETE_FOOD_FAILURE:
      return {
        ...state,
        fetching: false,
        saving: false,
        saveError: action.error
      };
    default: return state;
  }
};

export const selectors = {
  getAll(foodCategories, entities) {
    return denormalize({foodCategories}, {foodCategories: arrayOfFoodCategories}, entities).foodCategories;
  },
  getOne(id, entities) {
    return denormalize({foodCategories: id}, {foodCategories: foodCategory}, entities).foodCategories;
  },
  loading(foodCategory) {
    return foodCategory.fetching;
  },
  loadError(foodCategory) {
    return foodCategory.fetchError;
  }
}
