import {denormalize} from 'normalizr'

import {donor as donorSchema, arrayOfDonors} from '../../store/schemas'
import {CALL_API} from '../../store/middleware/api'
import {crudActions, crudReducer} from '../../store/utils'

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
  if (admin) endpoint = donor.id ? `admin/donors/${donor.id}` : `admin/donors`
  else endpoint = donor.id ? `donor/${donor.id}` : `donor`
  return {
    [CALL_API]: {
      endpoint,
      method: donor.id ? 'PUT' : 'POST',
      body: donor,
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

export const selectors = {
  getAll(donors, entities) {
    return denormalize({donors}, {donors: arrayOfDonors}, entities).donors
  },
  getOne(id, entities) {
    return denormalize({donors: id}, {donors: donorSchema}, entities).donors
  },
  loading(donors) {
    return donors.fetching
  },
  loadError(donors) {
    return donors.fetchError
  },
  saving(donors) {
    return donors.saving
  },
  saveError(donors) {
    return donors.saveError
  }
}
