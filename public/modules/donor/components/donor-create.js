import React from 'react'
import {Provider, connect} from 'react-redux'
import ReactDOM from 'react-dom'
import {AppContainer} from 'react-hot-loader'
import angular from 'angular';

import DonorCreate from './DonorCreate'

export default angular.module('customer')
  .component('donorCreate', {
    controller: function($ngRedux) {
      render(DonorCreate)

      function render(Component) {
        ReactDOM.render(
          <AppContainer>
            <Provider store={$ngRedux}>
              <Component />
            </Provider>
          </AppContainer>,
          document.getElementById('donor-create')
        )
      }

      if (module.hot) {
        module.hot.accept('./DonorCreate', () => {
          const Next = require('./DonorCreate').default
          render(Next)
        })
      }
    },
    template: '<div id="donor-create"></div>'
  })
  .name;
