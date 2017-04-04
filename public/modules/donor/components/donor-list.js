import React from 'react'
import {Provider, connect} from 'react-redux'
import ReactDOM from 'react-dom'
import {AppContainer} from 'react-hot-loader'
import angular from 'angular';

import DonorList from './DonorList'

export default angular.module('customer')
  .component('donorList', {
    controller: function($ngRedux) {
      render(DonorList)

      function render(Component) {
        ReactDOM.render(
          <AppContainer>
            <Provider store={$ngRedux}>
              <Component />
            </Provider>
          </AppContainer>,
          document.getElementById('donor-list')
        )
      }

      if (module.hot) {
        module.hot.accept('./DonorList', () => {
          const Next = require('./DonorList').default
          render(Next)
        })
      }
    },
    template: '<div id="donor-list"></div>'
  })
  .name;
