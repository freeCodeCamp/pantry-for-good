import union from 'lodash/union';
import difference from 'lodash/difference';
import {denormalize} from 'normalizr';

import {questionnaire, arrayOfQuestionnaires} from './schemas';
import {CALL_API} from '../middleware/api';

export const LOAD_QUESTIONNAIRES_REQUEST = 'questionnaire/LOAD_QUESTIONNAIRES_REQUEST';
export const LOAD_QUESTIONNAIRES_SUCCESS = 'questionnaire/LOAD_QUESTIONNAIRES_SUCCESS';
export const LOAD_QUESTIONNAIRES_FAILURE = 'questionnaire/LOAD_QUESTIONNAIRES_FAILURE';
export const LOAD_QUESTIONNAIRE_REQUEST = 'questionnaire/LOAD_QUESTIONNAIRE_REQUEST';
export const LOAD_QUESTIONNAIRE_SUCCESS = 'questionnaire/LOAD_QUESTIONNAIRE_SUCCESS';
export const LOAD_QUESTIONNAIRE_FAILURE = 'questionnaire/LOAD_QUESTIONNAIRE_FAILURE';
export const SAVE_QUESTIONNAIRE_REQUEST = 'questionnaire/SAVE_QUESTIONNAIRE_REQUEST';
export const SAVE_QUESTIONNAIRE_SUCCESS = 'questionnaire/SAVE_QUESTIONNAIRE_SUCCESS';
export const SAVE_QUESTIONNAIRE_FAILURE = 'questionnaire/SAVE_QUESTIONNAIRE_FAILURE';
export const DELETE_QUESTIONNAIRE_REQUEST = 'questionnaire/DELETE_QUESTIONNAIRE_REQUEST';
export const DELETE_QUESTIONNAIRE_SUCCESS = 'questionnaire/DELETE_QUESTIONNAIRE_SUCCESS';
export const DELETE_QUESTIONNAIRE_FAILURE = 'questionnaire/DELETE_QUESTIONNAIRE_FAILURE';

export const loadQuestionnaires = () => ({
  [CALL_API]: {
    endpoint: 'questionnaires',
    schema: arrayOfQuestionnaires,
    types: [LOAD_QUESTIONNAIRES_REQUEST, LOAD_QUESTIONNAIRES_SUCCESS, LOAD_QUESTIONNAIRES_FAILURE]
  }
});


export const loadQuestionnaire = id => ({
  [CALL_API]: {
    endpoint: `questionnaires/${id}`,
    schema: questionnaire,
    types: [LOAD_QUESTIONNAIRE_REQUEST, LOAD_QUESTIONNAIRE_SUCCESS, LOAD_QUESTIONNAIRE_FAILURE]
  }
});

export const saveQuestionnaire = questionnaire => ({
  [CALL_API]: {
    endpoint: questionnaire._id ? `questionnaires/${questionnaire._id}` : `questionnaires`,
    method: questionnaire._id ? 'PUT' : 'POST',
    schema: questionnaire,
    types: [SAVE_QUESTIONNAIRE_REQUEST, SAVE_QUESTIONNAIRE_SUCCESS, SAVE_QUESTIONNAIRE_FAILURE]
  }
});

export const deleteQuestionnaire = id => ({
  [CALL_API]: {
    endpoint: `questionnaires/${id}`,
    method: 'DELETE',
    types: [DELETE_QUESTIONNAIRE_REQUEST, DELETE_QUESTIONNAIRE_SUCCESS, DELETE_QUESTIONNAIRE_FAILURE]
  }
});

export default (state = {
  ids: []
}, action) => {
  switch (action.type) {
    case LOAD_QUESTIONNAIRES_REQUEST:
    case LOAD_QUESTIONNAIRE_REQUEST:
      return {
        ...state,
        fetching: true,
        saving: false,
        fetchError: null,
        saveError: null
      };
    case SAVE_QUESTIONNAIRE_REQUEST:
    case DELETE_QUESTIONNAIRE_REQUEST:
      return {
        ...state,
        fetching: false,
        saving: true,
        fetchError: null,
        saveError: null
      };
    case LOAD_QUESTIONNAIRES_SUCCESS:
    case LOAD_QUESTIONNAIRE_SUCCESS:
    case SAVE_QUESTIONNAIRE_SUCCESS:
    case DELETE_QUESTIONNAIRE_SUCCESS:
      const result = Array.isArray(action.response.result) ? action.response.result : [action.response.result];
      return {
        ...state,
        ids: action.type === DELETE_QUESTIONNAIRE_SUCCESS ?
                  difference(result, state.ids) :
                  union(result, state.ids),
        fetching: false,
        saving: false
      };
    case LOAD_QUESTIONNAIRES_FAILURE:
    case LOAD_QUESTIONNAIRE_FAILURE:
      return {
        ...state,
        fetching: false,
        saving: false,
        fetchError: action.error
      };
    case SAVE_QUESTIONNAIRE_FAILURE:
    case DELETE_QUESTIONNAIRE_FAILURE:
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
  getAll(questionnaires, entities) {
    return denormalize({questionnaires}, {questionnaires: arrayOfQuestionnaires}, entities).questionnaires;
  },
  getOne(id, entities) {
    return denormalize({questionnaires: id}, {questionnaires: questionnaire}, entities).questionnaires;
  }
}
