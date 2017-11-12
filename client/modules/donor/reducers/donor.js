import {denormalize} from 'normalizr'
import {createSelector} from 'reselect'
import {get, omit} from 'lodash'

import {donor as donorSchema, arrayOfDonors} from '../../../../common/schemas'
import {CALL_API} from '../../../store/middleware/api'
import {crudActions, crudReducer} from '../../../store/utils'

export const actions = crudActions('donor')

export const loadDonors = () => ({
  [CALL_API]: {
    endpoint: 'admin/donors',
    schema: arrayOfDonors,
    types: [actions.LOAD_ALL_REQUEST, actions.LOAD_ALL_SUCCESS, actions.LOAD_ALL_FAILURE]
  }
})

export const loadDonor = (id, admin) => ({
  [CALL_API]: {
    endpoint: admin ? `admin/donors/${id}` : `donor/${id}`,
    schema: donorSchema,
    types: [actions.LOAD_ONE_REQUEST, actions.LOAD_ONE_SUCCESS, actions.LOAD_ONE_FAILURE]
  }
})

export const saveDonor = (donor, admin) => {
  let endpoint
  if (admin) endpoint = donor._id ? `admin/donors/${donor._id}` : `admin/donors`
  else endpoint = donor._id ? `donor/${donor._id}` : `donor`
  return {
    [CALL_API]: {
      endpoint,
      method: donor._id ? 'PUT' : 'POST',
      body: omit(donor, 'donations'), // circular ref to donor crashes normalize
      schema: donorSchema,
      types: [actions.SAVE_REQUEST, actions.SAVE_SUCCESS, actions.SAVE_FAILURE]
    }
  }
}

export const deleteDonor = id => ({
  [CALL_API]: {
    endpoint: `admin/donors/${id}`,
    method: 'DELETE',
    schema: donorSchema,
    types: [actions.DELETE_REQUEST, actions.DELETE_SUCCESS, actions.DELETE_FAILURE]
  }
})

export default crudReducer('donor')

export const createSelectors = path => {
  const getEntities = state => state.entities

  return {
    getAll: createSelector(
      state => get(state, path).ids,
      getEntities,
      (donors, entities) =>
        denormalize({donors}, {donors: arrayOfDonors}, entities).donors
    ),
    getOne: state => id => createSelector(
      getEntities,
      entities =>
        denormalize({donors: id}, {donors: donorSchema}, entities).donors
    )(state),
    loading: state => get(state, path).fetching,
    loadError: state => get(state, path).fetchError,
    saving: state => get(state, path).saving,
    saveError: state => get(state, path).saveError
  }
}
