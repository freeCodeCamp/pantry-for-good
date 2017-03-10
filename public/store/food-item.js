import union from 'lodash/union';
import difference from 'lodash/difference';
import {denormalize} from 'normalizr';

import {
  foodCategory as foodCategorySchema,
  foodItem as foodItemSchema,
  arrayOfFoodItems
} from './schemas';
import {CALL_API} from '../middleware/api';
import {actions as foodCategoryActions} from './food-category';
import {crudActions} from './utils';

export const actions = crudActions('foodItem');

export const saveFoodItem = (categoryId, foodItem) => {
  console.log('saving foodItem', foodItem, 'in categoryId', categoryId)
  return {
    [CALL_API]: {
      endpoint: foodItem._id ? `admin/foods/${categoryId}/items/${foodItem._id}` : `admin/foods/${categoryId}/items`,
      method: foodItem._id ? 'PUT' : 'POST',
      body: foodItem,
      schema: foodItemSchema,
      responseSchema: foodCategorySchema,
      types: [actions.SAVE_REQUEST, actions.SAVE_SUCCESS, actions.SAVE_FAILURE]
    }
  };
};

export const deleteFoodItem = (categoryId, foodItemId) => ({
  [CALL_API]: {
    endpoint: `admin/foods/${foodItemId}`,
    method: 'DELETE',
    types: [actions.DELETE_REQUEST, actions.DELETE_SUCCESS, actions.DELETE_FAILURE]
  }
});

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
      };
    case actions.SAVE_SUCCESS:
    case actions.DELETE_SUCCESS:
      // save (and delete?) returns the whole updated food category
      const result = Object.keys(action.response.entities.foodItems);
      return {
        ...state,
        ids: action.type === actions.DELETE_SUCCESS ?
                              difference(result, state.ids) :
                              union(result, state.ids),
        saving: false
      };
    case foodCategoryActions.LOAD_ALL_SUCCESS:
      return {
        ...state,
        ids: Object.keys(action.response.entities.foodItems)
      };
    case actions.SAVE_FAILURE:
    case actions.DELETE_FAILURE:
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
    return denormalize({foodItems: id}, {foodItems: foodItemSchema}, entities).foodItems;
  }
}
