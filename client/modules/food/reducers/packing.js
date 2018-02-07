import {normalize} from 'normalizr'
import {get, union, without} from 'lodash'
import {createSelector} from 'reselect'
import {denormalize} from 'normalizr'

import {CALL_API, callApi} from '../../../store/middleware/api'

import {
  arrayOfCustomers,
  arrayOfFoodItems,
  arrayOfPackages,
  customer as customerSchema,
  foodPackage as packageSchema
} from '../../../../common/schemas'

export const LOAD_REQUEST = 'packing/LOAD_REQUEST'
export const LOAD_SUCCESS = 'packing/LOAD_SUCCESS'
export const LOAD_FAILURE = 'packing/LOAD_FAILURE'
export const PACK_REQUEST = 'packing/PACK_REQUEST'
export const PACK_SUCCESS = 'packing/PACK_SUCCESS'
export const PACK_FAILURE = 'packing/PACK_FAILURE'
export const UNPACK_REQUEST = 'packing/UNPACK_REQUEST'
export const UNPACK_SUCCESS = 'packing/UNPACK_SUCCESS'
export const UNPACK_FAILURE = 'packing/UNPACK_FAILURE'
export const CLEAR_FLAGS = 'packing/CLEAR_FLAGS'
export const RECEIVED_REQUEST = 'packing/RECEIVED_REQUEST'
export const RECEIVED_SUCCESS = 'packing/RECEIVED_SUCCESS'
export const RECEIVED_FAILURE = 'packing/RECEIVED_FAILURE'

const packRequest = () => ({type: PACK_REQUEST})
const packSuccess = response => ({type: PACK_SUCCESS, response})
const packFailure = error => ({type: PACK_FAILURE, error})
const receivedSuccess = response => ({type: RECEIVED_SUCCESS, response})

// newPackedCustomers has to be an aray of objects with this structure
// {customer: customerId, contents[foodItemId, foodItemId, foodItemId]}
export const pack = newPackedCustomers => dispatch => {
  dispatch(packRequest())

  const schema = {
    packages: arrayOfPackages,
    customers: arrayOfCustomers,
    foodItems: arrayOfFoodItems
  }

  return callApi('packing', 'POST', newPackedCustomers, null, schema)
    .then(res => dispatch(packSuccess(res)))
    .catch(error => dispatch(packFailure(error)))
}

export const deliveredPackage = singlePackage => dispatch => {
  dispatch({type: RECEIVED_REQUEST})
  
  return callApi('packing', 'PUT', {singlePackage})
    .then(res => {
      dispatch(receivedSuccess(res))
    })
    .catch(error => {
      dispatch({type: RECEIVED_FAILURE, error}
      )
    })
}

export const unpackPackage = packageId => dispatch => {
  dispatch({ type: UNPACK_REQUEST })

  const schema = {
    packages: packageSchema,
    foodItems: arrayOfFoodItems,
    customers: customerSchema
  }

  return callApi('packing', 'DELETE', { _id: packageId }, null, schema)
    .then(res => dispatch({ type: UNPACK_SUCCESS, response: res }))
    .catch(error => dispatch({ type: UNPACK_FAILURE, error }))
}

export const deliver = customerIds => dispatch => {
  dispatch(packRequest())
  callApi('admin/deliver', 'PUT', {customerIds})
    .then(res => {
      dispatch(packSuccess({
        entities: {
          customers: normalize(res.customers, arrayOfCustomers).entities
        }
      }))
    })
    .catch(err => dispatch(packFailure(err)))
}

export const clearPackingFlags = () => ({ type: CLEAR_FLAGS })

export const listPackages = () => {
  return {
    [CALL_API]: {
      endpoint: `packing`,
      method: 'GET',
      schema: arrayOfPackages,
      types: [LOAD_REQUEST, LOAD_SUCCESS, LOAD_FAILURE]
    }
  }
}

export default (state = {}, action) => {
  switch (action.type) {
    case LOAD_REQUEST:
      return {
        ...state,
        loading: true,
        loadError: null,
      }
    case LOAD_SUCCESS:
      return {
        ...state,
        ids: action.response.result,
        loading: false,
        loadError: null
      }
    case LOAD_FAILURE:
      return {
        ...state,
        loading: false,
        loadError: action.error
      }
    case PACK_REQUEST:
    case RECEIVED_REQUEST:
    case UNPACK_REQUEST:
      return {
        ...state,
        saving: true,
        saveError: null
      }
    case PACK_SUCCESS:
      return {
        ...state,
        ids: union(state.ids, action.response.result.packages),
        saving: false,
        saveError: null
      }
    case UNPACK_SUCCESS:
      return {
        ...state,
        // Use lodash without() to take the unpacked package out of the packing list
        ids: without(state.ids, action.response.result.packages),
        saving: false,
        saveError: null
      }
    case PACK_FAILURE:
    case RECEIVED_FAILURE:
    case UNPACK_FAILURE:
      return {
        ...state,
        saving: false,
        saveError: action.error
      }
    case CLEAR_FLAGS:
      return {
        ...state,
        loading: false,
        loadError: null,
        saving: false,
        saveError: null,
      }
    case RECEIVED_SUCCESS:
      return {
        ...state,
        saving: false,
        saveError: null,
      }
    default: return state
  }
}

export const createSelectors = path => {
  const packagesSelector = createSelector(
    state => get(state, path).ids,
    state => state.entities,
    (packages, entities) =>
      denormalize({packages}, {packages: arrayOfPackages}, entities).packages
  )

  return {
    packages: packagesSelector,
    loading: state => get(state, path).loading,
    loadError: state => get(state, path).loadError,
    saving: state => get(state, path).saving,
    saveError: state => get(state, path).saveError
  }
}
