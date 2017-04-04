import React from 'react'
import {Provider, connect} from 'react-redux'
import ReactDOM from 'react-dom'
import {AppContainer} from 'react-hot-loader'
import angular from 'angular';

import DonorCreateSuccess from './DonorCreateSuccess'

export default angular.module('customer')
  .component('donorCreateSuccess', {
    controller: function($ngRedux) {
      render(DonorCreateSuccess)

      function render(Component) {
        ReactDOM.render(
          <AppContainer>
            <Provider store={$ngRedux}>
              <Component />
            </Provider>
          </AppContainer>,
          document.getElementById('donor-create-success')
        )
      }

      if (module.hot) {
        module.hot.accept('./DonorCreateSuccess', () => {
          const Next = require('./DonorCreateSuccess').default
          render(Next)
        })
      }
    },
    template: '<div id="donor-create-success"></div>'
  })
  .name;
