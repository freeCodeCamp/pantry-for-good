import React from 'react'
import {Provider} from 'react-redux'
import ReactDOM from 'react-dom'
import {AppContainer} from 'react-hot-loader'
import angular from 'angular';

import ForgotPassword from './react/ForgotPassword'

export default angular.module('users')
  .component('forgotPasswordReact', {
    controller: function ($ngRedux) {
      render(ForgotPassword)

      function render(Component) {
        ReactDOM.render(
          <AppContainer>
            <Provider store={$ngRedux}>
              <Component />
            </Provider>
          </AppContainer>,
          document.getElementById('forgot-password')
        )
      }

      if (module.hot) {
        module.hot.accept('../components/react/ForgotPassword', () => {
          const Next = require('../components/react/ForgotPassword').default
          render(Next)
        })
      }
    },
    template: '<div id="forgot-password"></div>'
  })
  .name;
