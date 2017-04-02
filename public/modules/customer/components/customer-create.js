import React from 'react'
import {Provider} from 'react-redux'
import ReactDOM from 'react-dom'
import {AppContainer} from 'react-hot-loader'
import angular from 'angular';

import CustomerCreate from './CustomerCreate'

export default angular.module('customer')
  .component('customerCreate', {
    controller: ['$ngRedux', function($ngRedux) {
      render(CustomerCreate)

      function render(Component) {
        ReactDOM.render(
          <AppContainer>
            <Provider store={$ngRedux}>
              <Component />
            </Provider>
          </AppContainer>,
          document.getElementById('customer-create')
        )
      }

      if (module.hot) {
        module.hot.accept('./CustomerCreate', () => {
          const Next = require('./CustomerCreate').default
          render(Next)
        })
      }
    }],
    template: '<div id="customer-create"></div>'
  })
  .name;
