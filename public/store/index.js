import {combineReducers} from 'redux';
import {router} from 'redux-ui-router';
import merge from 'lodash/merge';

import auth from './auth';
import customer from './customer';
import field from './field';
import foodCategory from './food-category';
import foodItem from './food-item';
import media from './media';
import questionnaire from './questionnaire';
import section from './section';
import settings from './settings';

// Updates an entity cache in response to any action with response.entities.
const entities = (state = {
  customers: {},
  donations: {},
  donors: {},
  fields: {},
  foodCategories: {},
  foodItems: {},
  questionnaires: {},
  sections: {},
  users: {},
  volunteers: {}
}, action) => {
  if (action.response && action.response.entities) {
    return merge({}, state, action.response.entities);
  }

  return state;
};

export default combineReducers({
  entities,
  auth,
  customer,
  field,
  foodCategory,
  foodItem,
  media,
  questionnaire,
  router,
  section,
  settings
});
