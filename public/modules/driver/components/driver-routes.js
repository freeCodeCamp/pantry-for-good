import React from 'react'
import {Provider} from 'react-redux'
import ReactDOM from 'react-dom'
import {AppContainer} from 'react-hot-loader'
import angular from 'angular';

import DriverRoutes from './DriverRoutes'

export default angular.module('customer')
  .component('driverRoutes', {
    controller: function($ngRedux) {
      render(DriverRoutes)

      function render(Component) {
        ReactDOM.render(
          <AppContainer>
            <Provider store={$ngRedux}>
              <Component />
            </Provider>
          </AppContainer>,
          document.getElementById('driver-routes')
        )
      }

      if (module.hot) {
        module.hot.accept('./DriverRoutes', () => {
          const Next = require('./DriverRoutes').default
          render(Next)
        })
      }
    },
    template: '<div id="driver-routes"></div>'
  })
  .name;
