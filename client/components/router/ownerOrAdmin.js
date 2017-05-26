import React from 'react'
import PropTypes from 'prop-types'
import {compose, setDisplayName, setPropTypes} from 'recompose'

import Unauthorized from '../../modules/core/components/errors/Unauthorized'
import userOrRedirect from './userOrRedirect'

const enhance = compose(
  userOrRedirect,
  setPropTypes({match: PropTypes.object.isRequired}),
  setDisplayName('OwnerOrAdmin')
)

/**
 * Check if user is admin or id matches specified route param
 */
const ownerOrAdmin = param => WrappedComponent =>
  enhance(({user, ...props}) => {
    return user.roles.find(r => r === 'admin') ||
        String(user._id) === props.match.params[param] ?
      <WrappedComponent {...props} /> :
      <Unauthorized />
  })

export default ownerOrAdmin
