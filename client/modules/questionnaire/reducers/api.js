import {denormalize} from 'normalizr'
import {createSelector} from 'reselect'
import {flatMap, get, partition, values} from 'lodash'

import {questionnaire as questionnaireSchema, arrayOfQuestionnaires} from '../../../../common/schemas'
import {widgetTypes} from '../../../../common/constants'
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

export const createSelectors = path => {
  const getEntities = state => state.entities
  const getAll = createSelector(
    state => get(state, path).ids,
    getEntities,
    (questionnaires, entities) =>
      denormalize({questionnaires}, {questionnaires: arrayOfQuestionnaires}, entities).questionnaires
  )

  return {
    getAll,
    getOne: state => identifier => createSelector(
      getEntities,
      entities => {
        const ids = Object.keys(entities.questionnaires).filter(id =>
          entities.questionnaires[id].identifier === identifier)
        if (!ids.length) return

        return denormalize({questionnaires: ids[0]}, {questionnaires: questionnaireSchema}, entities).questionnaires
      }
    )(state),
    getLinkableFields: state => identifier => createSelector(
      getAll,
      questionnaires => {
        const [[thisQuestionnaire], otherQuestionnaires] =
          partition(questionnaires, q => q.identifier === identifier)

        const thisFields = flatMap(thisQuestionnaire.sections, section => section.fields)

        return otherQuestionnaires.map(q => ({
          ...q,
          fields: flatMap(q.sections, section => section.fields).filter(field =>
            values(widgetTypes).every(type => type !== field.type) &&
                thisFields.every(f => f._id !== field._id))
        })).filter(q => q.fields.length)
      }
    )(state),
    loading: state => get(state, path).fetching,
    loadError: state => get(state, path).fetchError,
    saving: state => get(state, path).saving,
    saveError: state => get(state, path).saveError
  }
}
