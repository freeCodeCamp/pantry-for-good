import fetch from 'isomorphic-fetch'
import {get} from 'lodash'

import {CALL_API} from '../../../store/middleware/api'

export const LOAD_REQUEST = 'media/LOAD_REQUEST'
export const LOAD_SUCCESS = 'media/LOAD_SUCCESS'
export const LOAD_FAILURE = 'media/LOAD_FAILURE'
export const SAVE_REQUEST = 'media/SAVE_REQUEST'
export const SAVE_SUCCESS = 'media/SAVE_SUCCESS'
export const SAVE_FAILURE = 'media/SAVE_FAILURE'

export const loadMedia = () => ({
  [CALL_API]: {
    endpoint: 'media',
    types: [LOAD_REQUEST, LOAD_SUCCESS, LOAD_FAILURE]
  }
})

const saveMediaRequest = () => ({type: SAVE_REQUEST})

const saveMediaSuccess = response => ({
  type: SAVE_SUCCESS,
  response
})

const saveMediaFailure = error => ({
  type: SAVE_FAILURE,
  error
})

export const saveMedia = (type, file) => dispatch => {
  const formData = new window.FormData()
  formData.append(type, file)

  dispatch(saveMediaRequest())

  // not using callApi because it json encodes body
  return fetch('/api/admin/media/upload', {
    method: 'POST',
    body: formData,
    credentials: 'same-origin'
  })
    .then(response => response.json().then(json =>
      dispatch(saveMediaSuccess(json))
    ))
    .catch(error => dispatch(saveMediaFailure(error)))
}

export default (state = {}, action) => {
  switch (action.type) {
    case LOAD_REQUEST:
      return {
        ...state,
        fetching: true,
        fetchError: null
      }
    case LOAD_SUCCESS:
      return {
        ...state,
        fetching: false,
        data: action.response
      }
    case LOAD_FAILURE:
      return {
        ...state,
        fetching: false,
        fetchError: action.error
      }
    case SAVE_REQUEST:
      return {
        ...state,
        saving: true,
        saveError: null
      }
    case SAVE_SUCCESS:
      return {
        ...state,
        saving: false,
        data: action.response
      }
    case SAVE_FAILURE:
      return {
        ...state,
        saving: false,
        saveError: action.error
      }
    default: return state
  }
}

export const createSelectors = path => ({
  getMedia: state => get(state, path).data,
  loading: state => get(state, path).fetching,
  loadError: state => get(state, path).fetchError,
  saving: state => get(state, path).saving,
  saveError: state => get(state, path).saveError
})
