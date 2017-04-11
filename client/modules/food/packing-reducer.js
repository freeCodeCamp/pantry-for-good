import {normalize} from 'normalizr'

import {callApi} from '../../store/middleware/api'
import {arrayOfCustomers, arrayOfFoodItems} from '../../store/schemas'

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
  callApi('admin/packing', 'PUT', {customers, items})
    .then(res => {
      dispatch(packSuccess({
        entities: {
          customers: normalize(res.customers, arrayOfCustomers).entities.customers,
          foodItems: normalize(res.items, arrayOfFoodItems).entities.foodItems
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
        fetching: true,
        error: null
      }
    case PACK_SUCCESS:
      return {
        ...state,
        fetching: false,
        error: null
      }
    case PACK_FAILURE:
      return {
        ...state,
        fetching: false,
        error: action.error
      }
    default: return state
  }
}
