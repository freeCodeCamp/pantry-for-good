import React from 'react'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import angular from 'angular';

import EditProfile from './react/EditProfile'

export default angular.module('users')
  .component('editProfileReact', {
    controller: function ($ngRedux) {

      function render(Component) {
        ReactDOM.render(
          <AppContainer>
            <Provider store={$ngRedux}>
              <Component />
            </Provider>
          </AppContainer>,
          document.getElementById('edit-profile')
        )
      }

      render(EditProfile)

      if (module.hot) {
        module.hot.accept('../components/react/EditProfile', () => {
          const Next = require('../components/react/EditProfile').default
          render(Next)
        })
      }
    },
    template: '<div id="edit-profile"></div>'
  })
  .name;
