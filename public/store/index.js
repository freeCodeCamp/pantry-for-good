import {combineReducers} from 'redux';
import {router} from 'redux-ui-router';
import merge from 'lodash/merge';

import auth from './auth';
import customer from './customer';
import food from './food';
import media from './media';
import settings from './settings';

// Updates an entity cache in response to any action with response.entities.
const entities = (state = {
  customers: {},
  donations: {},
  donors: {},
  fields: {},
  foods: {},
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
  food,
  media,
  router,
  settings
});
