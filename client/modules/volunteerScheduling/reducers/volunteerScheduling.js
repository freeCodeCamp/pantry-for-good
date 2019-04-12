import {CALL_API} from '../../../store/middleware/api'
import {crudActions, crudReducer} from '../../../store/utils'

export const actions = crudActions('volunteer')

export const makeShift = volunteerId => ({
  [CALL_API]: {
    endpoint: 'volunteers/addShift',
    method: 'PUT',
    body: volunteerId,
    types: [actions.SAVE_REQUEST, actions.SAVE_SUCCESS, actions.SAVE_FAILURE]
  }
})

export default crudReducer('volunteer')