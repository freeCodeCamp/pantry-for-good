import {normalize} from 'normalizr'
import {get} from 'lodash'

import {callApi} from '../../../store/middleware/api'
import {arrayOfCustomers, arrayOfFoodItems} from '../../../../common/schemas'

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
        entities: {
          customers: normalize(res.customers, arrayOfCustomers).entities.customers,
          foodItems: normalize(res.foodItems, arrayOfFoodItems).entities.foodItems
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

export default (state = {}, action) => {
  switch (action.type) {
    case PACK_REQUEST:
      return {
        ...state,
        saving: true,
        saveError: null
      }
    case PACK_SUCCESS:
      return {
        ...state,
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

export const createSelectors = path => ({
  saving: state => get(state, path).saving,
  saveError: state => get(state, path).saveError
})
