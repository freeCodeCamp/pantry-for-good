import {denormalize} from 'normalizr';

import {questionnaire, arrayOfQuestionnaires} from './schemas';
import {CALL_API} from '../middleware/api';
import {crudActions, crudReducer} from './utils';

export const actions = crudActions('questionnaire');

export const loadQuestionnaires = () => ({
  [CALL_API]: {
    endpoint: 'questionnaires',
    schema: arrayOfQuestionnaires,
    types: [actions.LOAD_ALL_REQUEST, actions.LOAD_ALL_SUCCESS, actions.LOAD_ALL_FAILURE]
  }
});

export const loadQuestionnaire = id => ({
  [CALL_API]: {
    endpoint: `questionnaires/${id}`,
    schema: questionnaire,
    types: [actions.LOAD_ONE_REQUEST, actions.LOAD_ONE_SUCCESS, actions.LOAD_ONE_FAILURE]
  }
});

export const saveQuestionnaire = questionnaire => ({
  [CALL_API]: {
    endpoint: questionnaire._id ? `questionnaires/${questionnaire._id}` : `questionnaires`,
    method: questionnaire._id ? 'PUT' : 'POST',
    schema: questionnaire,
    types: [actions.SAVE_REQUEST, actions.SAVE_SUCCESS, actions.SAVE_FAILURE]
  }
});

export const deleteQuestionnaire = id => ({
  [CALL_API]: {
    endpoint: `questionnaires/${id}`,
    method: 'DELETE',
    types: [actions.DELETE_REQUEST, actions.DELETE_SUCCESS, actions.DELETE_FAILURE]
  }
});

export default crudReducer('questionnaire');

export const selectors = {
  getAll(questionnaires, entities) {
    return denormalize({questionnaires}, {questionnaires: arrayOfQuestionnaires}, entities).questionnaires;
  },
  getOne(id, entities) {
    return denormalize({questionnaires: id}, {questionnaires: questionnaire}, entities).questionnaires;
  }
}
