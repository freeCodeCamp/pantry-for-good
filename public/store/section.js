import {denormalize} from 'normalizr';

import {section, arrayOfSections} from './schemas';
import {CALL_API} from '../middleware/api';
import {crudActions, crudReducer} from './utils';

export const actions = crudActions('section');

export const loadSections = () => ({
  [CALL_API]: {
    endpoint: 'sections',
    schema: arrayOfSections,
    types: [actions.LOAD_ALL_REQUEST, actions.LOAD_ALL_SUCCESS, actions.LOAD_ALL_FAILURE]
  }
});

export const loadSection = id => ({
  [CALL_API]: {
    endpoint: `sections/${id}`,
    schema: section,
    types: [actions.LOAD_ONE_REQUEST, actions.LOAD_ONE_SUCCESS, actions.LOAD_ONE_FAILURE]
  }
});

export const saveSection = section => ({
  [CALL_API]: {
    endpoint: section._id ? `sections/${section._id}` : `sections`,
    method: section._id ? 'PUT' : 'POST',
    schema: section,
    types: [actions.SAVE_REQUEST, actions.SAVE_SUCCESS, actions.SAVE_FAILURE]
  }
});

export const deleteSection = id => ({
  [CALL_API]: {
    endpoint: `sections/${id}`,
    method: 'DELETE',
    types: [actions.DELETE_REQUEST, actions.DELETE_SUCCESS, actions.DELETE_FAILURE]
  }
});

export default crudReducer('section');

export const selectors = {
  getAll(sections, entities) {
    return denormalize({sections}, {sections: arrayOfSections}, entities).sections;
  },
  getOne(id, entities) {
    return denormalize({sections: id}, {sections: section}, entities).sections;
  }
}
