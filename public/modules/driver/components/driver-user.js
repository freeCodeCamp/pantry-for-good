import React from 'react'
import {Provider} from 'react-redux'
import ReactDOM from 'react-dom'
import {AppContainer} from 'react-hot-loader'
import angular from 'angular';

import DriverUser from './DriverUser'

export default angular.module('customer')
  .component('driverUser', {
    controller: function($ngRedux) {
      render(DriverUser)

      function render(Component) {
        ReactDOM.render(
          <AppContainer>
            <Provider store={$ngRedux}>
              <Component />
            </Provider>
          </AppContainer>,
          document.getElementById('driver-user')
        )
      }

      if (module.hot) {
        module.hot.accept('./DriverUser', () => {
          const Next = require('./DriverUser').default
          render(Next)
        })
      }
    },
    template: '<div id="driver-user"></div>'
  })
  .name;
