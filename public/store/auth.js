import {CALL_API} from '../middleware/api';

export const SET_USER = 'auth/SET_USER';
export const CLEAR_USER = 'auth/CLEAR_USER';
export const SET_PROFILE_REQUEST = 'auth/SET_PROFILE_REQUEST';
export const SET_PROFILE_SUCCESS = 'auth/SET_PROFILE_SUCCESS';
export const SET_PROFILE_FAILURE = 'auth/SET_PROFILE_FAILURE';
export const SET_PASSWORD_SUCCESS = 'auth/SET_PASSWORD_SUCCESS';
export const SET_PASSWORD_REQUEST = 'auth/SET_PASSWORD_REQUEST';
export const SET_PASSWORD_FAILURE = 'auth/SET_PASSWORD_FAILURE';
export const SIGNUP_REQUEST = 'auth/SIGNUP_REQUEST';
export const SIGNUP_SUCCESS = 'auth/SIGNUP_SUCCESS';
export const SIGNUP_FAILURE = 'auth/SIGNUP_FAILURE';
export const SIGNIN_REQUEST = 'auth/SIGNIN_REQUEST';
export const SIGNIN_SUCCESS = 'auth/SIGNIN_SUCCESS';
export const SIGNIN_FAILURE = 'auth/SIGNIN_FAILURE';

export const setUser = user => ({
  type: SET_USER,
  user
});

export const clearUser = () => ({
  type: CLEAR_USER
});

export const setProfile = user => ({
  [CALL_API]: {
    endpoint: 'users',
    method: 'PUT',
    body: user,
    types: [SET_PROFILE_REQUEST, SET_PROFILE_SUCCESS, SET_PROFILE_FAILURE]
  }
});

export const setPassword = password => ({
  [CALL_API]: {
    endpoint: 'users/password',
    method: 'POST',
    body: password,
    types: [SET_PASSWORD_REQUEST, SET_PASSWORD_SUCCESS, SET_PASSWORD_FAILURE]
  }
});

export const signUp = credentials => ({
  [CALL_API]: {
    endpoint: 'auth/signup',
    method: 'POST',
    body: credentials,
    types: [SIGNUP_REQUEST, SIGNUP_SUCCESS, SIGNUP_FAILURE]
  }
});

export const signIn = credentials => ({
  [CALL_API]: {
    endpoint: 'auth/signin',
    method: 'POST',
    body: credentials,
    types: [SIGNIN_REQUEST, SIGNIN_SUCCESS, SIGNIN_FAILURE]
  }
});

export default (state = {user: null}, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        user: action.user
      };
    case CLEAR_USER:
      return {
        user: null
      };
    case SET_PROFILE_REQUEST:
    case SET_PASSWORD_REQUEST:
      return {
        ...state,
        success: null,
        error: null,
        fetching: true
      };
    case SIGNUP_REQUEST:
    case SIGNIN_REQUEST:
      return {
        fetching: true
      };
    case SET_PROFILE_SUCCESS:
    case SIGNUP_SUCCESS:
    case SIGNIN_SUCCESS:
      return {
        ...state,
        fetching: false,
        success: true,
        user: action.response
      };
    case SET_PASSWORD_SUCCESS:
      return {
        ...state,
        fetching: false,
        success: true,
      };
    case SET_PROFILE_FAILURE:
    case SET_PASSWORD_FAILURE:
    case SIGNUP_FAILURE:
    case SIGNIN_FAILURE:
      return {
        ...state,
        fetching: false,
        success: null,
        error: action.error
      }
    default: return state;
  }
};