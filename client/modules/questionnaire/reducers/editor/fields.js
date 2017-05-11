import {actions} from './index'

export default (state = {
  byId: {},
  allIds: []
}, action) => {
  switch (action.type) {
    case actions.INIT:
      return {
        byId: {...action.fields},
        allIds: Object.keys(action.fields)
      }
    case actions.ADD_FIELD:
      return {
        byId: {
          ...state.byId,
          [action.field._id]: action.field
        },
        allIds: [
          ...state.allIds,
          action.field._id
        ]
      }
    case actions.DELETE_FIELD:
      return {
        ...state,
        allIds: state.allIds.filter(id => id !== action.fieldId)
      }
    case actions.UPDATE_FIELD:
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.field._id]: {...action.field}
        }
      }
    default: return state
  }
}
