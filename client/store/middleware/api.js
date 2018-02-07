// https://github.com/reactjs/redux/blob/master/examples/real-world/src/middleware/api.js
import fetch from 'isomorphic-fetch'
import {normalize} from 'normalizr'
import {SubmissionError} from 'redux-form'

import {clearUser} from '../../modules/users/authReducer'

let _socket

const API_ROOT = process.env.NODE_ENV === 'production' ?
  '/api/' :
  'http://localhost:8080/api/'

// Fetches an API response and normalizes the result JSON according to schema.
// This makes every API response have the same shape, regardless of how nested it was.


/**
 * callApi - api client
 *
 * @export
 * @param {string} endpoint
 * @param {string} [method='GET']
 * @param {object} body
 * @param {any} schema to normalize the request and response
 * @param {any} responseSchema for when the response type differs
 * @returns promise
 */
export function callApi(endpoint, method = 'GET', body, schema, responseSchema) {
  const fullUrl = (endpoint.indexOf(API_ROOT) === -1) ? API_ROOT + endpoint : endpoint

  return fetch(fullUrl, {
    method,
    headers: generateRequestHeaders(method),
    body: formatRequestBody(body, method, schema),
    credentials: 'same-origin'
  })
    .then(response =>
      response.json().then(json => {
        if (!response.ok) return Promise.reject({ ...json, status: response.status })
        if (responseSchema) return normalize(json, responseSchema)
        if (schema) return normalize(json, schema)
        return json
      })
    )
}

// Action key that carries API call info interpreted by this Redux middleware.
export const CALL_API = 'Call API'

// A Redux middleware that interprets actions with CALL_API info specified.
// Performs the call and promises when such actions are dispatched.
export default socket => {
  _socket = socket
  return store => next => action => {
    const callAPI = action[CALL_API]
    if (typeof callAPI === 'undefined') {
      return next(action)
    }

    let {endpoint} = callAPI

    const {schema, responseSchema, types, method, body} = callAPI

    if (typeof endpoint === 'function') {
      endpoint = endpoint(store.getState())
    }

    if (typeof endpoint !== 'string') {
      throw new Error('Specify a string endpoint URL.')
    }

    if (!Array.isArray(types) || types.length !== 3) {
      throw new Error('Expected an array of three action types.')
    }

    if (!types.every(type => typeof type === 'string')) {
      throw new Error('Expected action types to be strings.')
    }

    const actionWith = data => {
      const finalAction = Object.assign({}, action, data)
      delete finalAction[CALL_API]
      delete finalAction.meta
      return finalAction
    }

    const [ requestType, successType, failureType ] = types

    next(actionWith({ type: requestType }))

    return callApi(endpoint, method, body, schema, responseSchema).then(
      response => next(actionWith({
        type: successType,
        response
      })),
      error => {
        if (error.status === 401) store.dispatch(clearUser())
        next(actionWith({
          type: failureType,
          error
        }))
        if (error.paths && action.meta && action.meta.submitValidate)
          throw new SubmissionError(error.paths)
      }
    )
  }
}

function formatRequestBody(body, method, schema) {
  if (!body) return

  if (schema) {
    // renormalize body before put/post
    const entityType = schema._key
    const normalized = normalize(body, schema).entities[entityType]
    const keys = Object.keys(normalized)

    if (keys.length !== 1) {
      throw new Error('Expected request body to contain a single entity')
    }

    // extract the entity and remove version attribute
    const entity = keys.map(k => normalized[k])[0]
    delete entity.__v
    if (method === 'PUT' && !('_id' in entity)) {
      throw new Error('Tried to PUT but entity has no _id attribute')
    }

    return JSON.stringify(entity)
  } else {
    return JSON.stringify(body)
  }
}

function generateRequestHeaders(method) {
  return method === 'GET' ?
    new Headers({}) :
    new Headers({
      'Content-Type': 'application/json',
      'Socket-ID': _socket ? _socket.id : ''
    })
}
