import union from 'lodash/union';
import difference from 'lodash/difference';
import {denormalize} from 'normalizr';

import {field, arrayOfFields} from './schemas';
import {CALL_API} from '../middleware/api';

export const LOAD_FIELDS_REQUEST = 'field/LOAD_FIELDS_REQUEST';
export const LOAD_FIELDS_SUCCESS = 'field/LOAD_FIELDS_SUCCESS';
export const LOAD_FIELDS_FAILURE = 'field/LOAD_FIELDS_FAILURE';
export const LOAD_FIELD_REQUEST = 'field/LOAD_FIELD_REQUEST';
export const LOAD_FIELD_SUCCESS = 'field/LOAD_FIELD_SUCCESS';
export const LOAD_FIELD_FAILURE = 'field/LOAD_FIELD_FAILURE';
export const SAVE_FIELD_REQUEST = 'field/SAVE_FIELD_REQUEST';
export const SAVE_FIELD_SUCCESS = 'field/SAVE_FIELD_SUCCESS';
export const SAVE_FIELD_FAILURE = 'field/SAVE_FIELD_FAILURE';
export const DELETE_FIELD_REQUEST = 'field/DELETE_FIELD_REQUEST';
export const DELETE_FIELD_SUCCESS = 'field/DELETE_FIELD_SUCCESS';
export const DELETE_FIELD_FAILURE = 'field/DELETE_FIELD_FAILURE';

export const loadFields = () => ({
  [CALL_API]: {
    endpoint: 'fields',
    schema: arrayOfFields,
    types: [LOAD_FIELDS_REQUEST, LOAD_FIELDS_SUCCESS, LOAD_FIELDS_FAILURE]
  }
});


export const loadField = id => ({
  [CALL_API]: {
    endpoint: `fields/${id}`,
    schema: field,
    types: [LOAD_FIELD_REQUEST, LOAD_FIELD_SUCCESS, LOAD_FIELD_FAILURE]
  }
});

export const saveField = field => ({
  [CALL_API]: {
    endpoint: field._id ? `fields/${field._id}` : `fields`,
    method: field._id ? 'PUT' : 'POST',
    schema: field,
    types: [SAVE_FIELD_REQUEST, SAVE_FIELD_SUCCESS, SAVE_FIELD_FAILURE]
  }
});

export const deleteField = id => ({
  [CALL_API]: {
    endpoint: `fields/${id}`,
    method: 'DELETE',
    types: [DELETE_FIELD_REQUEST, DELETE_FIELD_SUCCESS, DELETE_FIELD_FAILURE]
  }
});

export default (state = {
  ids: []
}, action) => {
  switch (action.type) {
    case LOAD_FIELDS_REQUEST:
    case LOAD_FIELD_REQUEST:
      return {
        ...state,
        fetching: true,
        saving: false,
        fetchError: null,
        saveError: null
      };
    case SAVE_FIELD_REQUEST:
    case DELETE_FIELD_REQUEST:
      return {
        ...state,
        fetching: false,
        saving: true,
        fetchError: null,
        saveError: null
      };
    case LOAD_FIELDS_SUCCESS:
    case LOAD_FIELD_SUCCESS:
    case SAVE_FIELD_SUCCESS:
    case DELETE_FIELD_SUCCESS:
      const result = Array.isArray(action.response.result) ? action.response.result : [action.response.result];
      return {
        ...state,
        ids: action.type === DELETE_FIELD_SUCCESS ?
                  difference(result, state.ids) :
                  union(result, state.ids),
        fetching: false,
        saving: false
      };
    case LOAD_FIELDS_FAILURE:
    case LOAD_FIELD_FAILURE:
      return {
        ...state,
        fetching: false,
        saving: false,
        fetchError: action.error
      };
    case SAVE_FIELD_FAILURE:
    case DELETE_FIELD_FAILURE:
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
  getAllFields(fields, entities) {
    return denormalize({fields}, {fields: arrayOfFields}, entities).fields;
  },
  getFieldById(id, entities) {
    return denormalize({fields: id}, {fields: field}, entities).fields;
  }
}
