import React, {Component} from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import Notify from 'react-s-alert'

import {ADMIN_ROLE} from '../common/constants'
import selectors from './store/selectors'
import {loadUser} from './modules/users/authReducer'
import {loadMedia} from './modules/settings/reducers/media'
import {loadSettings} from './modules/settings/reducers/settings'
import Router from './Router'
import ServerError from './modules/core/components/errors/ServerError'

const mapStateToProps = state => ({
  user: selectors.auth.getUser(state),
  loading: selectors.auth.fetching(state),
  error: selectors.auth.error(state)
})

const mapDispatchToProps = dispatch => ({
  load: () => {
    dispatch(loadMedia())
    dispatch(loadSettings())
    dispatch(loadUser())
  }
})

class Application extends Component {
  constructor(props) {
    super(props)
    this.state = {loaded: false}
  }

  componentWillMount() {
    this.props.load()
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.loading && !nextProps.loading &&
        !nextProps.error && !this.state.loaded) {
      this.setState({loaded: true})
    }
  }

  componentDidUpdate() {
    window.dispatchEvent(new Event('resize'))
  }

  render() {
    if (this.state.loaded) {
      const {user} = this.props
      const isAdmin = user && user.roles.find(r => r === ADMIN_ROLE)
      return (
        <div className={`skin-blue fixed ${!isAdmin && 'layout-top-nav'}`}>
          <div className='wrapper'>
            <Router history={this.props.history} />
            <Notify
              position={'top'}
              offset={0}
              timeout={5000}
              effect={'flip'}
              stack={{limit: 3}}
              html={true}
            />
          </div>
        </div>
      )
    }

    if (this.props.error) {
      return <ServerError />
    }

    return <Loading />
  }
}

Application.propTypes = {
  load: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.shape({
    message: PropTypes.string.isRequired
  }),
  user: PropTypes.object,
  history: PropTypes.object
}

export default connect(mapStateToProps, mapDispatchToProps)(Application)

function Loading() {
  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white'
    }}>
      <i className="fa fa-refresh fa-spin fa-2x" />
    </div>
  )
}
