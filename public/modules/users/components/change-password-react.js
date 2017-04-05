import React from 'react'
import {Provider} from 'react-redux'
import ReactDOM from 'react-dom'
import {AppContainer} from 'react-hot-loader'
import angular from 'angular';

import ChangePassword from './react/ChangePassword'

export default angular.module('users')
  .component('changePasswordReact', {
    controller: function ($ngRedux) {
      render(ChangePassword)

      function render(Component) {
        ReactDOM.render(
          <AppContainer>
            <Provider store={$ngRedux}>
              <Component />
            </Provider>
          </AppContainer>,
          document.getElementById('change-password')
        )
      }

      if (module.hot) {
        module.hot.accept('../components/react/ChangePassword', () => {
          const Next = require('../components/react/ChangePassword').default
          render(Next)
        })
      }
    },
    template: '<div id="change-password"></div>'
  })
  .name;
