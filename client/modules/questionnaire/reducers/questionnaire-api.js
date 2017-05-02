import {denormalize} from 'normalizr'

import {questionnaire as questionnaireSchema, arrayOfQuestionnaires} from '../../../store/schemas'
import {CALL_API} from '../../../store/middleware/api'
import {crudActions, crudReducer} from '../../../store/utils'

export const actions = crudActions('questionnaire')

export const loadQuestionnaires = () => ({
  [CALL_API]: {
    endpoint: 'questionnaires',
    schema: arrayOfQuestionnaires,
    types: [actions.LOAD_ALL_REQUEST, actions.LOAD_ALL_SUCCESS, actions.LOAD_ALL_FAILURE]
  }
})

export const loadQuestionnaire = id => ({
  [CALL_API]: {
    endpoint: `questionnaires/${id}`,
    schema: questionnaireSchema,
    types: [actions.LOAD_ONE_REQUEST, actions.LOAD_ONE_SUCCESS, actions.LOAD_ONE_FAILURE]
  }
})

export const saveQuestionnaire = questionnaire => ({
  [CALL_API]: {
    endpoint: questionnaire._id ? `questionnaires/${questionnaire._id}` : `questionnaires`,
    method: questionnaire._id ? 'PUT' : 'POST',
    body: questionnaire,
    responseSchema: questionnaireSchema,
    types: [actions.SAVE_REQUEST, actions.SAVE_SUCCESS, actions.SAVE_FAILURE]
  }
})

export const deleteQuestionnaire = id => ({
  [CALL_API]: {
    endpoint: `questionnaires/${id}`,
    method: 'DELETE',
    schema: questionnaireSchema,
    types: [actions.DELETE_REQUEST, actions.DELETE_SUCCESS, actions.DELETE_FAILURE]
  }
})

export default crudReducer('questionnaire')

export const selectors = {
  getAll(questionnaires, entities) {
    return denormalize({questionnaires}, {questionnaires: arrayOfQuestionnaires}, entities).questionnaires
  },
  getOne(identifier, entities) {
    const ids = Object.keys(entities.questionnaires).filter(id =>
      entities.questionnaires[id].identifier === identifier)
    if (!ids.length) return
    return denormalize({questionnaires: ids[0]}, {questionnaires: questionnaireSchema}, entities).questionnaires
  },
  loading(questionnaires) {
    return questionnaires.fetching
  },
  loadError(questionnaires) {
    return questionnaires.fetchError
  },
  saving(questionnaires) {
    return questionnaires.saving
  },
  saveError(questionnaires) {
    return questionnaires.saveError
  }
}
