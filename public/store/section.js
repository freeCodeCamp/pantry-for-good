import union from 'lodash/union';
import difference from 'lodash/difference';
import {denormalize} from 'normalizr';

import {section, arrayOfSections} from './schemas';
import {CALL_API} from '../middleware/api';

export const LOAD_SECTIONS_REQUEST = 'section/LOAD_SECTIONS_REQUEST';
export const LOAD_SECTIONS_SUCCESS = 'section/LOAD_SECTIONS_SUCCESS';
export const LOAD_SECTIONS_FAILURE = 'section/LOAD_SECTIONS_FAILURE';
export const LOAD_SECTION_REQUEST = 'section/LOAD_SECTION_REQUEST';
export const LOAD_SECTION_SUCCESS = 'section/LOAD_SECTION_SUCCESS';
export const LOAD_SECTION_FAILURE = 'section/LOAD_SECTION_FAILURE';
export const SAVE_SECTION_REQUEST = 'section/SAVE_SECTION_REQUEST';
export const SAVE_SECTION_SUCCESS = 'section/SAVE_SECTION_SUCCESS';
export const SAVE_SECTION_FAILURE = 'section/SAVE_SECTION_FAILURE';
export const DELETE_SECTION_REQUEST = 'section/DELETE_SECTION_REQUEST';
export const DELETE_SECTION_SUCCESS = 'section/DELETE_SECTION_SUCCESS';
export const DELETE_SECTION_FAILURE = 'section/DELETE_SECTION_FAILURE';

export const loadSections = () => ({
  [CALL_API]: {
    endpoint: 'sections',
    schema: arrayOfSections,
    types: [LOAD_SECTIONS_REQUEST, LOAD_SECTIONS_SUCCESS, LOAD_SECTIONS_FAILURE]
  }
});


export const loadSection = id => ({
  [CALL_API]: {
    endpoint: `sections/${id}`,
    schema: section,
    types: [LOAD_SECTION_REQUEST, LOAD_SECTION_SUCCESS, LOAD_SECTION_FAILURE]
  }
});

export const saveSection = section => ({
  [CALL_API]: {
    endpoint: section._id ? `sections/${section._id}` : `sections`,
    method: section._id ? 'PUT' : 'POST',
    schema: section,
    types: [SAVE_SECTION_REQUEST, SAVE_SECTION_SUCCESS, SAVE_SECTION_FAILURE]
  }
});

export const deleteSection = id => ({
  [CALL_API]: {
    endpoint: `sections/${id}`,
    method: 'DELETE',
    types: [DELETE_SECTION_REQUEST, DELETE_SECTION_SUCCESS, DELETE_SECTION_FAILURE]
  }
});

export default (state = {
  ids: []
}, action) => {
  switch (action.type) {
    case LOAD_SECTIONS_REQUEST:
    case LOAD_SECTION_REQUEST:
      return {
        ...state,
        fetching: true,
        saving: false,
        fetchError: null,
        saveError: null
      };
    case SAVE_SECTION_REQUEST:
    case DELETE_SECTION_REQUEST:
      return {
        ...state,
        fetching: false,
        saving: true,
        fetchError: null,
        saveError: null
      };
    case LOAD_SECTIONS_SUCCESS:
    case LOAD_SECTION_SUCCESS:
    case SAVE_SECTION_SUCCESS:
    case DELETE_SECTION_SUCCESS:
      const result = Array.isArray(action.response.result) ? action.response.result : [action.response.result];
      return {
        ...state,
        ids: action.type === DELETE_SECTION_SUCCESS ?
                  difference(result, state.ids) :
                  union(result, state.ids),
        fetching: false,
        saving: false
      };
    case LOAD_SECTIONS_FAILURE:
    case LOAD_SECTION_FAILURE:
      return {
        ...state,
        fetching: false,
        saving: false,
        fetchError: action.error
      };
    case SAVE_SECTION_FAILURE:
    case DELETE_SECTION_FAILURE:
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
  getAll(sections, entities) {
    return denormalize({sections}, {sections: arrayOfSections}, entities).sections;
  },
  getOne(id, entities) {
    return denormalize({sections: id}, {sections: section}, entities).sections;
  }
}
