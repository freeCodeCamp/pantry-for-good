import React from 'react'
import {Provider} from 'react-redux'
import ReactDOM from 'react-dom'
import {AppContainer} from 'react-hot-loader'
import angular from 'angular';

import SignIn from './react/SignIn'

export default angular.module('users')
  .component('signInReact', {
    controller: function ($ngRedux) {
      render(SignIn)

      function render(Component) {
        ReactDOM.render(
          <AppContainer>
            <Provider store={$ngRedux}>
              <Component />
            </Provider>
          </AppContainer>,
          document.getElementById('sign-in')
        )
      }
      if (module.hot) {
        module.hot.accept('../components/react/SignIn', () => {
          const Next = require('../components/react/SignIn').default
          render(Next)
        })
      }
    },
    template: '<div id="sign-in"></div>'
  })
  .name;
