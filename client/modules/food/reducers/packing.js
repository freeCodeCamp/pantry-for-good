import {normalize} from 'normalizr'
import {get, union} from 'lodash'
import {createSelector} from 'reselect'
import {denormalize} from 'normalizr'

import {CALL_API, callApi} from '../../../store/middleware/api'

import {arrayOfCustomers, arrayOfFoodItems, arrayOfPackages} from '../../../../common/schemas'

const LOAD_REQUEST = 'packages/LOAD_REQUEST'
const LOAD_SUCCESS = 'packages/LOAD_SUCCESS'
const LOAD_FAILURE = 'packages/LOAD_FAILURE'
const PACK_REQUEST = 'packing/PACK_REQUEST'
const PACK_SUCCESS = 'packing/PACK_SUCCESS'
const PACK_FAILURE = 'packing/PACK_FAILURE'

const packRequest = () => ({type: PACK_REQUEST})

const packSuccess = response => ({
  type: PACK_SUCCESS,
  response
})

const packFailure = error => ({type: PACK_FAILURE, error})

export const pack = (customers, items) => dispatch => {
  dispatch(packRequest())
  callApi('packing', 'PUT', {customers, items})
    .then(res => {
      dispatch(packSuccess({
        result: {
          newPackageIds: res.packages.map(item => item._id)
        },
        entities: {
          customers: normalize(res.customers, arrayOfCustomers).entities.customers,
          foodItems: normalize(res.foodItems, arrayOfFoodItems).entities.foodItems,
          packages: normalize(res.packages, arrayOfPackages).entities.packages
        }
      }))
    })
    .catch(err => dispatch(packFailure(err)))
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
    case PACK_FAILURE:
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
