import angular from 'angular';
import React, {Component} from 'react'
import {Provider, connect} from 'react-redux'
import ReactDOM from 'react-dom'
import {AppContainer} from 'react-hot-loader'

import {loadSettings} from '../../../store/settings';
import {loadMedia} from '../../../store/media'
import Navbar from './navbar/Navbar'

const mapStateToProps = state => ({
	auth: state.auth,
  settings: state.settings.data,
  fetchingSettings: state.settings.fetching,
  media: state.media.data,
  fetchingMedia: state.media.fetching
});

const mapDispatchToProps = dispatch => ({
  loadSettings: () => dispatch(loadSettings()),
  loadMedia: () => dispatch(loadMedia())
});

class HeaderComponent extends Component {
  constructor(props) {
    super(props)
    // eventually move these to top-level app component
    if (!props.settings && !props.fetchingSettings)
      props.loadSettings()
    if (!props.media && !props.fetchingMedia)
      props.loadMedia()
  }
  render() {
    const {settings, auth} = this.props
    return (
      <div>
        <a href="/#!/" className="logo">{settings && settings.organization}</a>
        <Navbar user={auth.user} />
      </div>
    )
  }
}

const Header = connect(mapStateToProps, mapDispatchToProps)(HeaderComponent)

export default Header

export const old = angular.module('core')
  .component('header', {
    controller: function($ngRedux) {
      render(Header)

      function render(Component) {
        ReactDOM.render(
          <AppContainer>
            <Provider store={$ngRedux}>
              <Component />
            </Provider>
          </AppContainer>,
          document.getElementById('header')
        )
      }

      if (module.hot) {
        module.hot.accept('./header', () => {
          const Next = require('./header').default
          render(Next)
        })
      }
    }
  })
  .name;
