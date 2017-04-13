import {CALL_API} from '../../store/middleware/api'

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

const saveMediaSuccess = response => ({
  type: SAVE_SUCCESS,
  response
})

const saveMediaFailure = error => ({
  type: SAVE_FAILURE,
  error
})

export const saveMedia = file => dispatch => {
  const formData = new FormData()
  formData.append('file', file)

  return fetch('/api/media/uploadLogo', {
    method: 'POST',
    body: formData
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
        error: null,
        success: null
      }
    case LOAD_SUCCESS:
      return {
        ...state,
        fetching: false,
        success: true,
        data: action.response
      }
    case LOAD_FAILURE:
      return {
        ...state,
        fetching: false,
        error: action.error
      }
    case SAVE_REQUEST:
      return {
        ...state,
        fetching: true,
        error: null,
        success: null
      }
    case SAVE_SUCCESS:
      return {
        ...state,
        fetching: false,
        success: true,
        data: action.response
      }
    case SAVE_FAILURE:
      return {
        ...state,
        fetching: false,
        error: action.error
      }
    default: return state
  }
}
