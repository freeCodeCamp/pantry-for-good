import union from 'lodash/union'
import difference from 'lodash/difference'

export const crudActions = name => ({
  LOAD_ALL_REQUEST: `${name}/LOAD_ALL_REQUEST`,
  LOAD_ALL_SUCCESS: `${name}/LOAD_ALL_SUCCESS`,
  LOAD_ALL_FAILURE: `${name}/LOAD_ALL_FAILURE`,
  LOAD_ONE_REQUEST: `${name}/LOAD_ONE_REQUEST`,
  LOAD_ONE_SUCCESS: `${name}/LOAD_ONE_SUCCESS`,
  LOAD_ONE_FAILURE: `${name}/LOAD_ONE_FAILURE`,
  SAVE_REQUEST: `${name}/SAVE_REQUEST`,
  SAVE_SUCCESS: `${name}/SAVE_SUCCESS`,
  SAVE_FAILURE: `${name}/SAVE_FAILURE`,
  DELETE_REQUEST: `${name}/DELETE_REQUEST`,
  DELETE_SUCCESS: `${name}/DELETE_SUCCESS`,
  DELETE_FAILURE: `${name}/DELETE_FAILURE`,
})

export const crudReducer = name =>
  (state = {
    ids: []
  }, action) => {
    switch (action.type) {
      case `${name}/LOAD_ALL_REQUEST`:
      case `${name}/LOAD_ONE_REQUEST`:
        return {
          ...state,
          fetching: true,
          saving: false,
          fetchError: null,
          saveError: null
        }
      case `${name}/SAVE_REQUEST`:
      case `${name}/DELETE_REQUEST`:
        return {
          ...state,
          fetching: false,
          saving: true,
          fetchError: null,
          saveError: null
        }
      case `${name}/LOAD_ALL_SUCCESS`:
      case `${name}/LOAD_ONE_SUCCESS`:
      case `${name}/SAVE_SUCCESS`:
      case `${name}/DELETE_SUCCESS`: {
        const result = Array.isArray(action.response.result) ?
          action.response.result :
          [action.response.result]

        return {
          ...state,
          ids: action.type === `${name}/DELETE_SUCCESS` ?
            difference(state.ids, result) :
            union(state.ids, result),
          fetching: false,
          saving: false
        }
      }
      case `${name}/LOAD_ALL_FAILURE`:
      case `${name}/LOAD_ONE_FAILURE`:
        return {
          ...state,
          fetching: false,
          saving: false,
          fetchError: action.error
        }
      case `${name}/SAVE_FAILURE`:
      case `${name}/DELETE_FAILURE`:
        return {
          ...state,
          fetching: false,
          saving: false,
          saveError: action.error
        }
      default: return state
    }
  }
