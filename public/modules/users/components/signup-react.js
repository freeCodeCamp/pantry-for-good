import React from 'react'
import {Provider} from 'react-redux'
import ReactDOM from 'react-dom'
import {AppContainer} from 'react-hot-loader'
import angular from 'angular';

import SignUp from './react/SignUp'

export default angular.module('users')
  .component('signUpReact', {
    controller: function ($ngRedux) {
      render(SignUp)

      function render(Component) {
        ReactDOM.render(
          <AppContainer>
            <Provider store={$ngRedux}>
              <Component />
            </Provider>
          </AppContainer>,
          document.getElementById('sign-up')
        )
      }
      if (module.hot) {
        module.hot.accept('../components/react/SignUp', () => {
          const Next = require('../components/react/SignUp').default
          render(Next)
        })
      }
    },
    template: '<div id="sign-up"></div>'
  })
  .name;
