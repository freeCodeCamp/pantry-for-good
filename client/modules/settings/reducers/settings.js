import {get} from 'lodash'

import {CALL_API} from '../../../store/middleware/api'

export const LOAD_REQUEST = 'settings/LOAD_REQUEST'
export const LOAD_SUCCESS = 'settings/LOAD_SUCCESS'
export const LOAD_FAILURE = 'settings/LOAD_FAILURE'
export const SAVE_REQUEST = 'settings/SAVE_REQUEST'
export const SAVE_SUCCESS = 'settings/SAVE_SUCCESS'
export const SAVE_FAILURE = 'settings/SAVE_FAILURE'

export const loadSettings = () => ({
  [CALL_API]: {
    endpoint: 'settings',
    types: [LOAD_REQUEST, LOAD_SUCCESS, LOAD_FAILURE]
  }
})

export const saveSettings = settings => ({
  [CALL_API]: {
    endpoint: 'settings',
    method: 'POST',
    body: settings,
    types: [SAVE_REQUEST, SAVE_SUCCESS, SAVE_FAILURE]
  },
  meta: {submitValidate: true}
})

export default (state = {}, action) => {
  switch (action.type) {
    case LOAD_REQUEST:
    case SAVE_REQUEST:
      return {
        ...state,
        fetching: true,
        error: null,
        success: null
      }
    case LOAD_SUCCESS:
    case SAVE_SUCCESS:
      return {
        ...state,
        data: action.response,
        fetching: false,
        success: true
      }
    case LOAD_FAILURE:
    case SAVE_FAILURE:
      return {
        ...state,
        fetching: false,
        error: action.error
      }
    default: return state
  }
}

export const createSelectors = path => ({
  getSettings: state => get(state, path).data,
  fetching: state => get(state, path).fetching,
  error: state => get(state, path).error,
  success: state => get(state, path).success
})
