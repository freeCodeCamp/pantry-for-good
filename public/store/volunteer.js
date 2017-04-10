import {denormalize} from 'normalizr';

import {volunteer as volunteerSchema, arrayOfVolunteers} from './schemas';
import {CALL_API} from './middleware/api';
import {crudActions, crudReducer} from './utils';

export const actions = crudActions('volunteer');

export const loadVolunteers = () => ({
  [CALL_API]: {
    endpoint: 'admin/volunteers',
    schema: arrayOfVolunteers,
    types: [actions.LOAD_ALL_REQUEST, actions.LOAD_ALL_SUCCESS, actions.LOAD_ALL_FAILURE]
  }
});

export const loadVolunteer = (id, admin) => ({
  [CALL_API]: {
    endpoint: admin ? `admin/volunteers/${id}` : `volunteer/${id}`,
    schema: volunteerSchema,
    types: [actions.LOAD_ONE_REQUEST, actions.LOAD_ONE_SUCCESS, actions.LOAD_ONE_FAILURE]
  }
});

export const saveVolunteer = (volunteer, admin) => {
  let endpoint;
  if (admin) endpoint = volunteer.id ? `admin/volunteers/${volunteer.id}` : `admin/volunteers`
  else endpoint = volunteer.id ? `volunteer/${volunteer.id}` : `volunteer`
  return {
    [CALL_API]: {
      endpoint,
      method: volunteer.id ? 'PUT' : 'POST',
      body: volunteer,
      schema: volunteerSchema,
      types: [actions.SAVE_REQUEST, actions.SAVE_SUCCESS, actions.SAVE_FAILURE]
    }
  };
};

export const deleteVolunteer = id => ({
  [CALL_API]: {
    endpoint: `admin/volunteers/${id}`,
    method: 'DELETE',
    schema: volunteerSchema,
    types: [actions.DELETE_REQUEST, actions.DELETE_SUCCESS, actions.DELETE_FAILURE]
  }
});

export default crudReducer('volunteer');

export const selectors = {
  getAll(volunteers, entities) {
    return denormalize({volunteers}, {volunteers: arrayOfVolunteers}, entities).volunteers;
  },
  getOne(id, entities) {
    return denormalize({volunteers: id}, {volunteers: volunteerSchema}, entities).volunteers;
  },
  loading(volunteers) {
    return volunteers.fetching;
  },
  loadError(volunteers) {
    return volunteers.fetchError;
  },
  saving(volunteers) {
    return volunteers.saving;
  },
  saveError(volunteers) {
    return volunteers.saveError;
  }
}
