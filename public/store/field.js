import {denormalize} from 'normalizr';

import {field, arrayOfFields} from './schemas';
import {CALL_API} from '../middleware/api';
import {crudActions, crudReducer} from './utils';

export const actions = crudActions('field');

export const loadFields = () => ({
  [CALL_API]: {
    endpoint: 'fields',
    schema: arrayOfFields,
    types: [actions.LOAD_ALL_REQUEST, actions.LOAD_ALL_SUCCESS, actions.LOAD_ALL_FAILURE]
  }
});

export const loadField = id => ({
  [CALL_API]: {
    endpoint: `fields/${id}`,
    schema: field,
    types: [actions.LOAD_ONE_REQUEST, actions.LOAD_ONE_SUCCESS, actions.LOAD_ONE_FAILURE]
  }
});

export const saveField = field => ({
  [CALL_API]: {
    endpoint: field._id ? `fields/${field._id}` : `fields`,
    method: field._id ? 'PUT' : 'POST',
    schema: field,
    types: [actions.SAVE_REQUEST, actions.SAVE_SUCCESS, actions.SAVE_FAILURE]
  }
});

export const deleteField = id => ({
  [CALL_API]: {
    endpoint: `fields/${id}`,
    method: 'DELETE',
    types: [actions.DELETE_REQUEST, actions.DELETE_SUCCESS, actions.DELETE_FAILURE]
  }
});

export default crudReducer('field');

export const selectors = {
  getAll(fields, entities) {
    return denormalize({fields}, {fields: arrayOfFields}, entities).fields;
  },
  getOne(id, entities) {
    return denormalize({fields: id}, {fields: field}, entities).fields;
  }
}
