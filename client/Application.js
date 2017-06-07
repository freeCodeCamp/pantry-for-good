import React, {Component} from 'react'
import {connect} from 'react-redux'

import selectors from './store/selectors'
import {loadUser} from './modules/users/reducer'
import {loadMedia} from './modules/settings/reducers/media'
import {loadSettings} from './modules/settings/reducers/settings'
import Router from './Router'
import ServerError from './modules/core/components/errors/ServerError'

const mapStateToProps = state => ({
  user: selectors.user.getUser(state),
  loading: selectors.user.fetching(state),
  error: selectors.user.error(state)
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
    const {user} = this.props
    window.dispatchEvent(new Event('resize'))
    if (user && user.roles.find(r => r === 'admin')) {
      $('body').removeClass('layout-top-nav')
    }
  }

  render() {
    if (this.state.loaded) return <Router history={this.props.history} />

    if (this.props.error) {
      return <ServerError />
    }

    return <Loading />
  }
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

