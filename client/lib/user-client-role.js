import {head, intersection, values} from 'lodash'

import {clientRoles} from '../../common/constants'

/**
 * get the client type of a user
 *
 * @param {?object} user
 * @returns {(string|undefined)} the client role
 */
function userClientRole(user) {
  if (!user) return
  return head(intersection(user.roles, values(clientRoles)))
}

export default userClientRole
