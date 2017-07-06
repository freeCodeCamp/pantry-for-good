import {normalize} from 'normalizr'
import {get, union, without} from 'lodash'
import {createSelector} from 'reselect'
import {denormalize} from 'normalizr'

import {CALL_API, callApi} from '../../../store/middleware/api'

import {arrayOfCustomers, arrayOfPackages} from '../../../../common/schemas'

const LOAD_REQUEST = 'packing/LOAD_REQUEST'
const LOAD_SUCCESS = 'packing/LOAD_SUCCESS'
const LOAD_FAILURE = 'packing/LOAD_FAILURE'
const PACK_REQUEST = 'packing/PACK_REQUEST'
const PACK_SUCCESS = 'packing/PACK_SUCCESS'
const PACK_FAILURE = 'packing/PACK_FAILURE'
const UNPACK_REQUEST = 'packing/UNPACK_REQUEST'
const UNPACK_SUCCESS = 'packing/UNPACK_SUCCESS'
const UNPACK_FAILURE = 'packing/UNPACK_FAILURE'

const packRequest = () => ({type: PACK_REQUEST})
const packSuccess = response => ({type: PACK_SUCCESS, response})
const packFailure = error => ({type: PACK_FAILURE, error})

// newPackedCustomers has to be an aray of objects with this structure
// {customer: customerId, contents[foodItemId, foodItemId, foodItemId]}
export const pack = newPackedCustomers => dispatch => {
  dispatch(packRequest())
  const apiURL = 'packing'  //eventually resolves to something like 'http://hostname/api/packing'
  const httpMethod = 'POST'
  callApi(apiURL, httpMethod, newPackedCustomers)
    .then(res => {
      const response = {
        result: { newPackageIds: res.packages.map(item => item._id) },
        entities: {
          packages: normalize(res.packages, arrayOfPackages).entities.packages,
          customers: res.customerUpdates,
          foodItems: res.foodItemUpdates
        }
      }
      dispatch({type: PACK_SUCCESS, response})
    })
    .catch(error => dispatch({type: PACK_FAILURE, error}))
}

export const unpackPackage = packageId => dispatch => {
  dispatch({ type: UNPACK_REQUEST })
  const apiURL = 'packing'  // eventually resolves to something like 'http://hostname/api/packing'
  const httpMethod = 'DELETE'
  callApi(apiURL, httpMethod, { _id: packageId })
    .then(res => {
      const response = {
        result: res.deletedPackage && res.deletedPackage._id,
        entities: {
          customers: res.updatedCustomer,
          foodItems: res.updatedItemCounts
        }
      }
      dispatch({ type: UNPACK_SUCCESS, response })
    })
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
    case UNPACK_REQUEST:
      return {
        ...state,
        saving: true,
        saveError: null
      }
    case PACK_SUCCESS:
      return {
        ...state,
        ids: union(state.ids, action.response.result.newPackageIds),
        saving: false,
        saveError: null
      }
    case UNPACK_SUCCESS:
      return {
        ...state,
        // Use lodash without() to take the unpacked package out of the packing list
        ids: without(state.ids, action.response.result),
        saving: false,
        saveError: null
      }
    case PACK_FAILURE:
    case UNPACK_FAILURE:
      return {
        ...state,
        saving: false,
        saveError: action.error
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
