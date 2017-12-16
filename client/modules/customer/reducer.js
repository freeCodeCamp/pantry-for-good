import {denormalize} from 'normalizr'
import {createSelector} from 'reselect'
import {get} from 'lodash'
import {utc} from 'moment'

import {customer as customerSchema, arrayOfCustomers} from '../../../common/schemas'
import {CALL_API} from '../../store/middleware/api'
import {crudActions, crudReducer} from '../../store/utils'

export const actions = crudActions('customer')

export const loadCustomers = () => ({
  [CALL_API]: {
    endpoint: 'admin/customer',
    schema: arrayOfCustomers,
    types: [actions.LOAD_ALL_REQUEST, actions.LOAD_ALL_SUCCESS, actions.LOAD_ALL_FAILURE]
  }
})

export const loadCustomer = id => ({
  [CALL_API]: {
    endpoint: `customer/${id}`,
    schema: customerSchema,
    types: [actions.LOAD_ONE_REQUEST, actions.LOAD_ONE_SUCCESS, actions.LOAD_ONE_FAILURE]
  }
})

export const saveCustomer = customer => {
  const endpoint = customer._id ? `customer/${customer._id}` : `customer`
  return {
    [CALL_API]: {
      endpoint,
      method: customer._id ? 'PUT' : 'POST',
      body: customer,
      schema: customerSchema,
      types: [actions.SAVE_REQUEST, actions.SAVE_SUCCESS, actions.SAVE_FAILURE]
    },
    meta: {submitValidate: true}
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

export default crudReducer('customer')

export const createSelectors = path => {
  const getEntities = state => state.entities
  const getAll = createSelector(
    state => get(state, path).ids,
    getEntities,
    (customers, entities) => {
      let customerList = denormalize({customers}, {customers: arrayOfCustomers}, entities).customers
      if (customerList) {
        // For each customer, filter out items marked as deleted in the foodPreferences array
        customerList = customerList.map(customer => {
          if (!customer.foodPreferences) {
            return customer
          } else {
            // Filter out deleted items that may be in foodPreferences
            const foodPreferences = customer.foodPreferences.filter(item => (item && item.deleted) ? !item.deleted : true )
            return {...customer, foodPreferences}
          }
        })
      }
      return customerList
    }
  )

  return {
    getAll,
    getOne: state => id => createSelector(
      getEntities,
      entities =>
        denormalize({customers: id}, {customers: customerSchema}, entities).customers
    )(state),
    getScheduled: createSelector(
      getAll,
      customers => {
        const beginWeek = utc().startOf('isoWeek')
        return customers.filter(customer =>
          customer.status === 'Accepted' && !utc(customer.lastPacked).isSame(beginWeek))
      }
    ),
    loading: state => get(state, path).fetching,
    loadError: state => get(state, path).fetchError,
    saving: state => get(state, path).saving,
    saveError: state => get(state, path).saveError
  }
}
