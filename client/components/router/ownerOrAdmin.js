import React from 'react'
import PropTypes from 'prop-types'
import {compose, setPropTypes} from 'recompose'

import {ADMIN_ROLE} from '../../../common/constants'
import Unauthorized from '../../modules/core/components/errors/Unauthorized'
import userOrRedirect from './userOrRedirect'

const enhance = compose(
  userOrRedirect,
  setPropTypes({match: PropTypes.object.isRequired})
)

/**
 * Check if user is admin or id matches specified route param
 */
const ownerOrAdmin = param => WrappedComponent =>
  enhance(({user, ...props}) => {
    return user.roles.find(r => r === ADMIN_ROLE) ||
        String(user._id) === props.match.params[param] ?
      <WrappedComponent {...props} /> :
      <Unauthorized />
  })

export default ownerOrAdmin
