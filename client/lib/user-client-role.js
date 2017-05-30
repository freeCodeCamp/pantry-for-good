import {head, intersection} from 'lodash'

/**
 * get the client type of a user
 *
 * @param {?object} user
 * @returns {(string|undefined)} the client role
 */
function userClientRole(user) {
  const clientTypes = ['customer', 'donor', 'volunteer']
  return user && head(intersection(user.roles, clientTypes))
}

export default userClientRole
