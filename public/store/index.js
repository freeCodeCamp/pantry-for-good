import {combineReducers} from 'redux';
import {router} from 'redux-ui-router';
import merge from 'lodash/merge';

import auth from './auth';
import media from './media';
import settings from './settings';

// Updates an entity cache in response to any action with response.entities.
const entities = (state = { users: {}, repos: {} }, action) => {
  if (action.response && action.response.entities) {
    return merge({}, state, action.response.entities);
  }

  return state;
};

export default combineReducers({
  entities,
  auth,
  media,
  router,
  settings
});
