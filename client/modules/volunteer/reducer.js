import {denormalize} from 'normalizr'
import {createSelector} from 'reselect'
import {get} from 'lodash'

import {volunteerRoles} from '../../../common/constants'
import {volunteer as volunteerSchema, arrayOfVolunteers} from '../../../common/schemas'
import {CALL_API} from '../../store/middleware/api'
import {crudActions, crudReducer} from '../../store/utils'

export const actions = crudActions('volunteer')

export const loadVolunteers = () => ({
  [CALL_API]: {
    endpoint: 'admin/volunteers',
    schema: arrayOfVolunteers,
    types: [actions.LOAD_ALL_REQUEST, actions.LOAD_ALL_SUCCESS, actions.LOAD_ALL_FAILURE]
  }
})

export const loadVolunteer = (id, admin) => ({
  [CALL_API]: {
    endpoint: admin ? `admin/volunteers/${id}` : `volunteer/${id}`,
    schema: volunteerSchema,
    types: [actions.LOAD_ONE_REQUEST, actions.LOAD_ONE_SUCCESS, actions.LOAD_ONE_FAILURE]
  }
})

export const saveVolunteer = (volunteer, admin) => {
  let endpoint
  if (admin) endpoint = volunteer._id ? `admin/volunteers/${volunteer._id}` : `admin/volunteers`
  else endpoint = volunteer._id ? `volunteer/${volunteer._id}` : `volunteer`
  return {
    [CALL_API]: {
      endpoint,
      method: volunteer._id ? 'PUT' : 'POST',
      body: volunteer,
      schema: volunteerSchema,
      types: [actions.SAVE_REQUEST, actions.SAVE_SUCCESS, actions.SAVE_FAILURE]
    },
    meta: {submitValidate: true}
  }
}

export const deleteVolunteer = id => ({
  [CALL_API]: {
    endpoint: `admin/volunteers/${id}`,
    method: 'DELETE',
    schema: volunteerSchema,
    types: [actions.DELETE_REQUEST, actions.DELETE_SUCCESS, actions.DELETE_FAILURE]
  }
})

export default crudReducer('volunteer')

export const createSelectors = path => {
  const getEntities = state => state.entities
  const getAll = createSelector(
    state => get(state, path).ids,
    getEntities,
    (volunteers, entities) =>
      denormalize({volunteers}, {volunteers: arrayOfVolunteers}, entities).volunteers
  )
  return {
    getAll,
    getAllDrivers: createSelector(
      getAll,
      volunteers => volunteers.filter(v => v.status === 'Active' &&
          get(v.user, 'roles', []).find(r => r === volunteerRoles.DRIVER))
    ),
    getOne: state => id => createSelector(
      getEntities,
      entities =>
        denormalize({volunteers: id}, {volunteers: volunteerSchema}, entities).volunteers
    )(state),
    loading: state => get(state, path).fetching,
    loadError: state => get(state, path).fetchError,
    saving: state => get(state, path).saving,
    saveError: state => get(state, path).saveError
  }
}
