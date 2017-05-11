import {actions} from './index'

export default (state = {
  byId: {},
  allIds: []
}, action) => {
  switch (action.type) {
    case actions.INIT:
      return {
        byId: {...action.sections},
        allIds: Object.keys(action.sections)
      }
    case actions.ADD_SECTION:
      return {
        byId: {
          ...state.byId,
          [action.section._id]: action.section
        },
        allIds: [
          ...state.allIds,
          action.section._id
        ]
      }
    case actions.DELETE_SECTION:
      return {
        ...state,
        allIds: state.allIds.filter(id => id !== action.sectionId)
      }
    case actions.UPDATE_SECTION:
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.section._id]: {...action.section}
        }
      }
    case actions.MOVE_SECTION: {
      const withoutSection = state.allIds.filter(id => id !== action.sectionId)
      return {
        ...state,
        allIds: [
          ...withoutSection.slice(0, action.idx),
          action.sectionId,
          ...withoutSection.slice(action.idx)
        ]
      }
    }
    case actions.MOVE_FIELD: {
      const section = state.byId[action.sectionId]
      const withoutField = section.fields.filter(id =>
        id !== action.fieldId)

      return {
        ...state,
        byId: {
          ...state.byId,
          [section._id]: {
            ...section,
            fields: [
              ...withoutField.slice(0, action.idx),
              action.fieldId,
              ...withoutField.slice(action.idx)
            ]
          }
        }
      }
    }
    case actions.ADD_FIELD:
      return {
        ...state,
        byId: addField(state.byId, action)
      }
    case actions.DELETE_FIELD:
      return {
        ...state,
        byId: deleteField(state.byId, action)
      }
    default: return state
  }
}

function addField(sections, action) {
  const {field, sectionId} = action
  const section = sections[sectionId]
  const fields = section.fields || []

  return {
    ...sections,
    [sectionId]: {
      ...section,
      fields: fields.concat(field._id)
    }
  }
}

function deleteField(sections, action) {
  const {fieldId, sectionId} = action
  const section = sections[sectionId]
  const fields = section.fields || []

  return {
    ...sections,
    [sectionId]: {
      ...section,
      fields: fields.filter(f => f !== fieldId)
    }
  }
}
