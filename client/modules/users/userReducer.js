import { get } from 'lodash'
import { createSelector } from 'reselect'
import { denormalize } from 'normalizr'

import { arrayOfUsers, user as userSchema } from '../../../common/schemas'
import { CALL_API } from '../../store/middleware/api'
import { crudActions, crudReducer } from '../../store/utils'

export const actions = crudActions('user')

export const loadUsers = () => ({
  [CALL_API]: {
    endpoint: 'users',
    schema: arrayOfUsers,
    types: [actions.LOAD_ALL_REQUEST, actions.LOAD_ALL_SUCCESS, actions.LOAD_ALL_FAILURE]
  }
})

export const getUserById = userId => ({
  [CALL_API]: {
    endpoint: `admin/users/${userId}`,
    schema: userSchema,
    types: [actions.LOAD_ONE_REQUEST, actions.LOAD_ONE_SUCCESS, actions.LOAD_ONE_FAILURE]
  }
})

export const editUser = user => ({
  [CALL_API]: {
    endpoint: `admin/users/${user._id}`,
    method: 'PUT',
    body: user,
    schema: userSchema,
    types: [actions.SAVE_REQUEST, actions.SAVE_SUCCESS, actions.SAVE_FAILURE]
  }
})

export default crudReducer('user')

export const createSelectors = path => {
  const usersSelector = createSelector(
    state => get(state, path).ids,
    state => state.entities,
    (users, entities) => denormalize({ users }, { users: arrayOfUsers }, entities).users
  )

  return {
    users: usersSelector,
    fetching: state => get(state, path).fetching,
    saving: state => get(state, path).saving,
    fetchError: state => get(state, path).fetchError,
    saveError: state => get(state, path).saveError,
  }
}
