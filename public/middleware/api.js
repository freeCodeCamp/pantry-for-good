// https://github.com/reactjs/redux/blob/master/examples/real-world/src/middleware/api.js
import {normalize} from 'normalizr';
import angular from 'angular';

const API_ROOT = 'http://localhost:8080/api/';

// Fetches an API response and normalizes the result JSON according to schema.
// This makes every API response have the same shape, regardless of how nested it was.


/**
 * callApi - api client
 *
 * @export
 * @param {string} endpoint
 * @param {string} [method='GET']
 * @param {object} body
 * @param {any} schema
 * @returns promise
 */
export function callApi(endpoint, method = 'GET', body, schema) {
  const fullUrl = (endpoint.indexOf(API_ROOT) === -1) ? API_ROOT + endpoint : endpoint;
  const headers = method === 'GET' ? null : new Headers({
    'Content-Type': 'application/json'
  });

  if (body && schema) {
    // renormalize body before put/post
    // assume element types not arrays
    const entityType = schema._key;
    const wrappedEntity = normalize(body, schema).entities[entityType]
    const entity = Object.keys(wrappedEntity).map(k => wrappedEntity[k])[0];
    delete entity.__v;

    // normalize or denormalize removes _id?
    // angular.toJson omits angular specific attributes
    body = angular.toJson({...entity, _id: Number(entity.id)});
  } else if (body) {
    body = angular.toJson(body);
  }

  return fetch(fullUrl, {
    method,
    headers,
    body,
    credentials: 'same-origin'
  })
    .then(response =>
      response.json().then(json => {
        if (!response.ok) {
          return Promise.reject(json);
        }

        return schema ? normalize(json, schema) : json;
      })
    );
};

// Action key that carries API call info interpreted by this Redux middleware.
export const CALL_API = 'Call API';

// A Redux middleware that interprets actions with CALL_API info specified.
// Performs the call and promises when such actions are dispatched.
export default store => next => action => {
  const callAPI = action[CALL_API];
  if (typeof callAPI === 'undefined') {
    return next(action);
  }

  let { endpoint } = callAPI;
  const { schema, types, method, body } = callAPI;

  if (typeof endpoint === 'function') {
    endpoint = endpoint(store.getState());
  }

  if (typeof endpoint !== 'string') {
    throw new Error('Specify a string endpoint URL.');
  }
  // if (!schema) {
  //   throw new Error('Specify one of the exported Schemas.');
  // }
  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('Expected an array of three action types.');
  }
  if (!types.every(type => typeof type === 'string')) {
    throw new Error('Expected action types to be strings.');
  }

  const actionWith = data => {
    const finalAction = Object.assign({}, action, data);
    delete finalAction[CALL_API];
    return finalAction;
  }

  const [ requestType, successType, failureType ] = types;
  next(actionWith({ type: requestType }));

  return callApi(endpoint, method, body, schema).then(
    response => next(actionWith({
      response,
      type: successType
    })),
    error => next(actionWith({
      type: failureType,
      error: error.message || 'Something bad happened'
    }))
  );
};
