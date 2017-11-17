import React from 'react'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'

import selectors from '../../store/selectors'
import userClientRole from '../../lib/user-client-role'

const mapStateToProps = state => ({
  user: selectors.auth.getUser(state)
})

const mapDispatchToProps = dispatch => ({
  push: location => dispatch(push(location))
})

const redirectIfAlreadySignedIn = props => {
  if (props.user && props.user._id) {
    const role = userClientRole(props.user)
    props.push(role ? `/${role.split('/')[1]}s` : '/')
  }
}

const guestOrRedirect = WrappedComponent => {
  class GuestOrRedirect extends React.Component {
    constructor(props) {
      super(props)
      redirectIfAlreadySignedIn(props)
    }
  
    componentWillReceiveProps(nextProps) {
      redirectIfAlreadySignedIn(nextProps)
    }
  
    render() {
      return <WrappedComponent {...this.props} />
    }
  }

  return connect(mapStateToProps, mapDispatchToProps)(GuestOrRedirect)
}

export default guestOrRedirect
