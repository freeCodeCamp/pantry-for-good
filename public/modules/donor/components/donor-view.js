import React from 'react'
import {Provider, connect} from 'react-redux'
import ReactDOM from 'react-dom'
import {AppContainer} from 'react-hot-loader'
import angular from 'angular';

import DonorView from './DonorView'

export default angular.module('customer')
  .component('donorView', {
    controller: function($ngRedux) {
      render(DonorView)

      function render(Component) {
        ReactDOM.render(
          <AppContainer>
            <Provider store={$ngRedux}>
              <Component />
            </Provider>
          </AppContainer>,
          document.getElementById('donor-view')
        )
      }

      if (module.hot) {
        module.hot.accept('./DonorView', () => {
          const Next = require('./DonorView').default
          render(Next)
        })
      }
    },
    template: '<div id="donor-view"></div>'
  })
  .name;
