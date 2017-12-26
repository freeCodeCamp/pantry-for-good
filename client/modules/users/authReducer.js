import {get} from 'lodash'

import {CALL_API} from '../../store/middleware/api'

import {denormalize} from 'normalizr'
import {createSelector} from 'reselect'
import { arrayOfNotifications, notification as notificationSchema } from '../../../common/schemas'
import { crudActions} from '../../store/utils'
export const actions = crudActions('auth')

export const CLEAR_USER = 'auth/CLEAR_USER'
export const CLEAR_FLAGS = 'auth/CLEAR_FLAGS'
export const SET_PROFILE_REQUEST = 'auth/SET_PROFILE_REQUEST'
export const SET_PROFILE_SUCCESS = 'auth/SET_PROFILE_SUCCESS'
export const SET_PROFILE_FAILURE = 'auth/SET_PROFILE_FAILURE'
export const SET_PASSWORD_SUCCESS = 'auth/SET_PASSWORD_SUCCESS'
export const SET_PASSWORD_REQUEST = 'auth/SET_PASSWORD_REQUEST'
export const SET_PASSWORD_FAILURE = 'auth/SET_PASSWORD_FAILURE'
export const FORGOT_PASSWORD_SUCCESS = 'auth/FORGOT_PASSWORD_SUCCESS'
export const FORGOT_PASSWORD_REQUEST = 'auth/FORGOT_PASSWORD_REQUEST'
export const FORGOT_PASSWORD_FAILURE = 'auth/FORGOT_PASSWORD_FAILURE'
export const RESET_PASSWORD_SUCCESS = 'auth/RESET_PASSWORD_SUCCESS'
export const RESET_PASSWORD_REQUEST = 'auth/RESET_PASSWORD_REQUEST'
export const RESET_PASSWORD_FAILURE = 'auth/RESET_PASSWORD_FAILURE'
export const SIGNUP_REQUEST = 'auth/SIGNUP_REQUEST'
export const SIGNUP_SUCCESS = 'auth/SIGNUP_SUCCESS'
export const SIGNUP_FAILURE = 'auth/SIGNUP_FAILURE'
export const SIGNIN_REQUEST = 'auth/SIGNIN_REQUEST'
export const SIGNIN_SUCCESS = 'auth/SIGNIN_SUCCESS'
export const SIGNIN_FAILURE = 'auth/SIGNIN_FAILURE'
export const LOAD_REQUEST = 'auth/LOAD_REQUEST'
export const LOAD_SUCCESS = 'auth/LOAD_SUCCESS'
export const LOAD_FAILURE = 'auth/LOAD_FAILURE'
export const LOAD_NOTIFICATION_REQUEST = 'auth/LOAD_NOTIFICATION_REQUEST'
export const LOAD_NOTIFICATION_SUCCESS = 'auth/LOAD_NOTIFICATION_SUCCESS'
export const LOAD_NOTIFICATION_FAILURE = 'auth/LOAD_NOTIFICATION_FAILURE'

export const clearUser = () => ({type: CLEAR_USER})

export const clearFlags = () => ({type: CLEAR_FLAGS})

export const loadNotifications = () => ({
  [CALL_API]: {
    endpoint: '/users/me/notifications',
    schema: arrayOfNotifications,
    types: [LOAD_NOTIFICATION_REQUEST, LOAD_NOTIFICATION_SUCCESS, LOAD_NOTIFICATION_FAILURE]
  }
})

export const deleteNotification = id => ({
  [CALL_API]: {
    endpoint: `/users/me/notifications?id=${id}`,
    method: 'DELETE',
    schema: notificationSchema,
    types: [actions.DELETE_REQUEST, actions.DELETE_SUCCESS, actions.DELETE_FAILURE]
  }
})

export const deleteAllNotifications = () => ({
  [CALL_API]: {
    endpoint: `/users/me/notifications?id=`,
    method: 'DELETE',
    schema: notificationSchema,
    types: [actions.DELETE_REQUEST, actions.DELETE_SUCCESS, actions.DELETE_FAILURE]
  }
})

export const setProfile = user => ({
  [CALL_API]: {
    endpoint: 'users/me',
    method: 'PUT',
    body: user,
    types: [SET_PROFILE_REQUEST, SET_PROFILE_SUCCESS, SET_PROFILE_FAILURE]
  }
})

export const setPassword = password => ({
  [CALL_API]: {
    endpoint: 'users/password',
    method: 'POST',
    body: password,
    types: [SET_PASSWORD_REQUEST, SET_PASSWORD_SUCCESS, SET_PASSWORD_FAILURE]
  }
})

export const forgotPassword = credentials => ({
  [CALL_API]: {
    endpoint: 'auth/forgot',
    method: 'POST',
    body: credentials,
    types: [FORGOT_PASSWORD_REQUEST, FORGOT_PASSWORD_SUCCESS, FORGOT_PASSWORD_FAILURE]
  }
})

export const resetPassword = (token, password) => ({
  [CALL_API]: {
    endpoint: `auth/reset/${token}`,
    method: 'POST',
    body: { password: password},
    types: [RESET_PASSWORD_REQUEST, RESET_PASSWORD_SUCCESS, RESET_PASSWORD_FAILURE]
  }
})

export const signUp = credentials => ({
  [CALL_API]: {
    endpoint: 'auth/signup',
    method: 'POST',
    body: credentials,
    types: [SIGNUP_REQUEST, SIGNUP_SUCCESS, SIGNUP_FAILURE]
  }
})

export const signIn = credentials => ({
  [CALL_API]: {
    endpoint: 'auth/signin',
    method: 'POST',
    body: credentials,
    types: [SIGNIN_REQUEST, SIGNIN_SUCCESS, SIGNIN_FAILURE]
  }
})

export const loadUser = () => ({
  [CALL_API]: {
    endpoint: 'users/me',
    types: [LOAD_REQUEST, LOAD_SUCCESS, LOAD_FAILURE]
  }
})

const removeNotification = (state, actionIndex) => {
  const notifications = [
    ...state.user.notifications.slice(0, actionIndex),
    ...state.user.notifications.slice(actionIndex + 1),
  ]
  return {
    ...state,
    user: {
      ...state.user,
      notifications
    }
  }
}

const removeAllNotification = state => {
  const notifications = []
  return {
    ...state,
    user: {
      ...state.user,
      notifications
    }
  }
}

export default (state = {user: null}, action) => {
  switch (action.type) {
    case CLEAR_USER:
      return {
        user: null
      }
    case CLEAR_FLAGS:
      return {
        ...state,
        success: null,
        error: null,
        fetching: false
      }
    case SET_PROFILE_REQUEST:
    case SET_PASSWORD_REQUEST:
    case FORGOT_PASSWORD_REQUEST:
    case RESET_PASSWORD_REQUEST:
    case SIGNUP_REQUEST:
    case SIGNIN_REQUEST:
    case LOAD_REQUEST:
      return {
        ...state,
        success: null,
        error: null,
        fetching: true
      }
    case SET_PROFILE_SUCCESS:
    case SIGNUP_SUCCESS:
    case SIGNIN_SUCCESS:
    case LOAD_SUCCESS:
      return {
        ...state,
        fetching: false,
        success: true,
        user: action.response || state.user,
        error: null
      }
    case SET_PASSWORD_SUCCESS:
    case FORGOT_PASSWORD_SUCCESS:
    case RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        fetching: false,
        success: action.response,
        error: null
      }
    case SET_PROFILE_FAILURE:
    case SET_PASSWORD_FAILURE:
    case FORGOT_PASSWORD_FAILURE:
    case RESET_PASSWORD_FAILURE:
    case SIGNUP_FAILURE:
    case SIGNIN_FAILURE:
    case LOAD_FAILURE:
      return {
        ...state,
        fetching: false,
        success: null,
        error: action.error
      }
    case `DEL_NOTIFICATION`:
      return removeNotification(state, action.index)
    case `DEL_ALL_NOTIFICATIONS`:
      return removeAllNotification(state)
    default: return state
  }
}

export const createSelectors = path => {
  const getEntities = state => state.entities
  return {
    getAllNotifications: createSelector(
      state => get(state, path).user.notifications,
      getEntities,
      (notifications, entities) =>
        denormalize({notifications}, {notifications: arrayOfNotifications}, entities).notifications
    ),
    getUser: state => get(state, path).user,
    fetching: state => get(state, path).fetching,
    loading: state => get(state, path).fetching,
    loadError: state => get(state, path).fetchError,
    error: state => get(state, path).error,
    success: state => get(state, path).success,
    saving: state => get(state, path).saving,
    saveError: state => get(state, path).saveError
  }
}
