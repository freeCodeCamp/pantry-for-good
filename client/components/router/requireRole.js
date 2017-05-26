import React from 'react'
import {compose, setDisplayName} from 'recompose'
import {intersection} from 'lodash'

import Unauthorized from '../../modules/core/components/errors/Unauthorized'
import userOrRedirect from './userOrRedirect'

const enhance = compose(userOrRedirect, setDisplayName('RequireRole'))

/**
 * This can be used to wrap components and only render them if the user is
 * logged on and has a role that matches one in the authorizedRoles param
 */
const requireRole = authorizedRoles => WrappedComponent =>
  enhance(({user, ...props}) => {
    return intersection(authorizedRoles, user.roles).length > 0 ?
      <WrappedComponent {...props} /> :
      <Unauthorized />
  })

export default requireRole
