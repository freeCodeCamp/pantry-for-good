import {denormalize} from 'normalizr'
import {createSelector} from 'reselect'
import {get} from 'lodash'

import {customer as customerSchema, arrayOfCustomers} from '../../store/schemas'
import {CALL_API, callApi} from '../../store/middleware/api'
import {crudActions, crudReducer} from '../../store/utils'

export const actions = crudActions('customer')

export const loadCustomers = () => ({
  [CALL_API]: {
    endpoint: 'admin/customers',
    schema: arrayOfCustomers,
    types: [actions.LOAD_ALL_REQUEST, actions.LOAD_ALL_SUCCESS, actions.LOAD_ALL_FAILURE]
  }
})

export const loadCustomer = (id, admin) => ({
  [CALL_API]: {
    endpoint: admin ? `admin/customers/${id}` : `customer/${id}`,
    schema: customerSchema,
    types: [actions.LOAD_ONE_REQUEST, actions.LOAD_ONE_SUCCESS, actions.LOAD_ONE_FAILURE]
  }
})

export const saveCustomer = (customer, admin) => {
  let endpoint
  if (admin) endpoint = customer.id ? `admin/customers/${customer.id}` : `admin/customers`
  else endpoint = customer.id ? `customer/${customer.id}` : `customer`
  return {
    [CALL_API]: {
      endpoint,
      method: customer.id ? 'PUT' : 'POST',
      body: customer,
      schema: customerSchema,
      types: [actions.SAVE_REQUEST, actions.SAVE_SUCCESS, actions.SAVE_FAILURE]
    }
  }
}

export const deleteCustomer = id => ({
  [CALL_API]: {
    endpoint: `admin/customers/${id}`,
    method: 'DELETE',
    schema: customerSchema,
    types: [actions.DELETE_REQUEST, actions.DELETE_SUCCESS, actions.DELETE_FAILURE]
  }
})

// TODO: maybe better way to do this
export const assignCustomers = (customerIds, driverId) => dispatch => {
  const body = {customerIds, driverId}
  callApi('admin/customers/assign', 'POST', body, null, arrayOfCustomers)
    .then(response => {
      dispatch({type: actions.SAVE_SUCCESS, response})
    })
    .catch(error => dispatch({type: actions.SAVE_FAILURE, error}))
}

export default crudReducer('customer')

export const createSelectors = path => {
  const getEntities = state => state.entities

  return {
    getAll: createSelector(
      state => get(state, path).ids,
      getEntities,
      (customers, entities) =>
        denormalize({customers}, {customers: arrayOfCustomers}, entities).customers
    ),
    getOne: state => id => createSelector(
      getEntities,
      entities =>
        denormalize({customers: id}, {customers: customerSchema}, entities).customers
    )(state),
    loading: state => get(state, path).fetching,
    loadError: state => get(state, path).fetchError,
    saving: state => get(state, path).saving,
    saveError: state => get(state, path).saveError
  }
}
