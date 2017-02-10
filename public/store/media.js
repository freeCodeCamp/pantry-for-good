import {CALL_API} from '../middleware/api';

export const LOAD_REQUEST = 'media/LOAD_REQUEST';
export const LOAD_SUCCESS = 'media/LOAD_SUCCESS';
export const LOAD_FAILURE = 'media/LOAD_FAILURE';
export const SET_MEDIA = 'media/SET_MEDIA';

export const loadMedia = () => ({
  [CALL_API]: {
    endpoint: 'media',
    types: [LOAD_REQUEST, LOAD_SUCCESS, LOAD_FAILURE]
  }
});

export const setMedia = (path, file) => ({
  type: SET_MEDIA,
  path,
  file
});

export default (state = {}, action) => {
  switch (action.type) {
    case LOAD_REQUEST:
      return {
        ...state,
        fetching: true,
        error: null,
        success: null
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        fetching: false,
        success: true,
        data: action.response
      };
    case LOAD_FAILURE:
      return {
        ...state,
        fetching: false,
        error: action.error
      };
    case SET_MEDIA:
      return {
        ...state,
        data: {
          ...data,
          logoPath: action.path,
          logoFile: action.file
        }
      };
    default: return state;
  }
};
