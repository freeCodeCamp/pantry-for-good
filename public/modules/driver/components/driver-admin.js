import React from 'react'
import {Provider} from 'react-redux'
import ReactDOM from 'react-dom'
import {AppContainer} from 'react-hot-loader'
import angular from 'angular';

import DriverAdmin from './DriverAdmin'

export default angular.module('customer')
  .component('driverAdmin', {
    controller: function($ngRedux) {
      render(DriverAdmin)

      function render(Component) {
        ReactDOM.render(
          <AppContainer>
            <Provider store={$ngRedux}>
              <Component />
            </Provider>
          </AppContainer>,
          document.getElementById('driver-admin')
        )
      }

      if (module.hot) {
        module.hot.accept('./DriverAdmin', () => {
          const Next = require('./DriverAdmin').default
          render(Next)
        })
      }
    },
    template: '<div id="driver-admin"></div>'
  })
  .name;
