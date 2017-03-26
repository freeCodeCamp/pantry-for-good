import angular from 'angular'
import React from 'react'
import {Provider, connect} from 'react-redux'
import ReactDOM from 'react-dom'
import {AppContainer} from 'react-hot-loader'

const mapStateToProps = state => ({
  settings: state.settings.data,
});

const FooterComponent = ({settings}) => (
  <div>
    <strong>Copyright &copy; 2016&nbsp;
      <a href="/#!/">{settings && settings.organization}</a>.
    </strong>
    &ensp;All rights reserved.
  </div>
)

const Footer = connect(mapStateToProps)(FooterComponent)

export default Footer

export const old = angular.module('core')
  .component('footer', {
    controller: function($ngRedux) {
      render(Footer)

      function render(Component) {
        ReactDOM.render(
          <AppContainer>
            <Provider store={$ngRedux}>
              <Component />
            </Provider>
          </AppContainer>,
          document.getElementById('footer')
        )
      }

      if (module.hot) {
        module.hot.accept('./footer', () => {
          const Next = require('./footer').default
          render(Next)
        })
      }
    }
  })
  .name;
