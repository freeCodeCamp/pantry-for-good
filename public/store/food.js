import union from 'lodash/union';
import difference from 'lodash/difference';

import {food, arrayOfFoods} from './schemas';
import {CALL_API} from '../middleware/api';

export const LOAD_FOODS_REQUEST = 'food/LOAD_FOODS_REQUEST';
export const LOAD_FOODS_SUCCESS = 'food/LOAD_FOODS_SUCCESS';
export const LOAD_FOODS_FAILURE = 'food/LOAD_FOODS_FAILURE';
export const LOAD_FOOD_REQUEST = 'food/LOAD_FOOD_REQUEST';
export const LOAD_FOOD_SUCCESS = 'food/LOAD_FOOD_SUCCESS';
export const LOAD_FOOD_FAILURE = 'food/LOAD_FOOD_FAILURE';
export const SAVE_FOOD_REQUEST = 'food/SAVE_FOOD_REQUEST';
export const SAVE_FOOD_SUCCESS = 'food/SAVE_FOOD_SUCCESS';
export const SAVE_FOOD_FAILURE = 'food/SAVE_FOOD_FAILURE';
export const DELETE_FOOD_REQUEST = 'food/DELETE_FOOD_REQUEST';
export const DELETE_FOOD_SUCCESS = 'food/DELETE_FOOD_SUCCESS';
export const DELETE_FOOD_FAILURE = 'food/DELETE_FOOD_FAILURE';

export const loadFoods = () => ({
  [CALL_API]: {
    endpoint: 'admin/foods',
    schema: arrayOfFoods,
    types: [LOAD_FOODS_REQUEST, LOAD_FOODS_SUCCESS, LOAD_FOODS_FAILURE]
  }
});

export const loadFood = id => ({
  [CALL_API]: {
    endpoint: `food/${id}`,
    schema: food,
    types: [LOAD_FOOD_REQUEST, LOAD_FOOD_SUCCESS, LOAD_FOOD_FAILURE]
  }
});

export const saveFood = food => ({
  [CALL_API]: {
    endpoint: food._id ? `food/${food._id}` : `food`,
    method: food._id ? 'PUT' : 'POST',
    schema: food,
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
    case LOAD_FOOD_REQUEST:
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
    case LOAD_FOOD_SUCCESS:
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
    case LOAD_FOOD_FAILURE:
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
