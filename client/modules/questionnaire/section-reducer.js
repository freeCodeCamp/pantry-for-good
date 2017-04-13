import {denormalize} from 'normalizr'

import {section as sectionSchema, arrayOfSections} from '../../store/schemas'
import {CALL_API} from '../../store/middleware/api'
import {crudActions, crudReducer} from '../../store/utils'

export const actions = crudActions('section')

export const loadSections = () => ({
  [CALL_API]: {
    endpoint: 'sections',
    schema: arrayOfSections,
    types: [actions.LOAD_ALL_REQUEST, actions.LOAD_ALL_SUCCESS, actions.LOAD_ALL_FAILURE]
  }
})

export const loadSection = id => ({
  [CALL_API]: {
    endpoint: `sections/${id}`,
    schema: sectionSchema,
    types: [actions.LOAD_ONE_REQUEST, actions.LOAD_ONE_SUCCESS, actions.LOAD_ONE_FAILURE]
  }
})

export const saveSection = section => ({
  [CALL_API]: {
    endpoint: section._id ? `sections/${section._id}` : `sections`,
    method: section._id ? 'PUT' : 'POST',
    body: section,
    schema: sectionSchema,
    types: [actions.SAVE_REQUEST, actions.SAVE_SUCCESS, actions.SAVE_FAILURE]
  }
})

export const deleteSection = id => ({
  [CALL_API]: {
    endpoint: `sections/${id}`,
    method: 'DELETE',
    schema: sectionSchema,
    types: [actions.DELETE_REQUEST, actions.DELETE_SUCCESS, actions.DELETE_FAILURE]
  }
})

export default crudReducer('section')

export const selectors = {
  getAll(sections, entities) {
    return denormalize({sections}, {sections: arrayOfSections}, entities).sections
  },
  getOne(id, entities) {
    return denormalize({sections: id}, {sections: sectionSchema}, entities).sections
  },
  saving(section) {
    return section.saving
  },
  saveError(section) {
    return section.saveError
  },
  loading(section) {
    return section.fetching
  },
  loadError(section) {
    return section.fetchError
  }
}
