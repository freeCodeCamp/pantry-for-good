import React from 'react'
import { connect } from 'react-redux'
import { intersection } from 'lodash'
import { Redirect } from 'react-router'
import Unauthorized from '../modules/core/components/errors/Unauthorized'

/**
 * This can be used to wrap components and only render them if the user is 
 * logged on and has a role that matches one in the authorizedRoles prop
 * 
 * If redirectIfNotLoggedIn is set it will redirect to the signin page if
 * a user is not logged in.  If showUnauthorized is set it will show the
 * unauthorized component it the user does not have the proper role

 */
const RequireRole = ({ authorizedRoles, redirectIfNotLoggedIn, showUnauthorized, userRoles, children }) => {
  if (!userRoles) {
    // Not logged in
    return redirectIfNotLoggedIn ? <Redirect to="/users/signin"/> : null
  } else if (intersection(authorizedRoles, userRoles).length > 0) {
    // Has required role
    return children
  } else {
    // Doesn't have required role
    return showUnauthorized ? <Unauthorized /> : null
  }
}

RequireRole.propTypes = {
  authorizedRoles: React.PropTypes.array.isRequired
}

const mapStateToProps = state => ({
  userRoles: state.auth.user ? state.auth.user.roles : null
})

export default connect(mapStateToProps)(RequireRole)
