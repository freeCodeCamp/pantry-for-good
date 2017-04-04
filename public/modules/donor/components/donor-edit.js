import React from 'react'
import {Provider, connect} from 'react-redux'
import ReactDOM from 'react-dom'
import {AppContainer} from 'react-hot-loader'
import angular from 'angular';

import DonorEdit from './DonorEdit'

export default angular.module('customer')
  .component('donorEdit', {
    controller: function($ngRedux) {
      render(DonorEdit)

      function render(Component) {
        ReactDOM.render(
          <AppContainer>
            <Provider store={$ngRedux}>
              <Component />
            </Provider>
          </AppContainer>,
          document.getElementById('donor-edit')
        )
      }

      if (module.hot) {
        module.hot.accept('./DonorEdit', () => {
          const Next = require('./DonorEdit').default
          render(Next)
        })
      }
    },
    template: '<div id="donor-edit"></div>'
  })
  .name;
