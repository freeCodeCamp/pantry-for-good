import React from 'react'
import {Provider} from 'react-redux'
import ReactDOM from 'react-dom'
import {AppContainer} from 'react-hot-loader'
import angular from 'angular';

import CustomerList from './CustomerList'

export default angular.module('customer')
  .component('customerList', {
    controller: ['$ngRedux', function($ngRedux) {
      render(CustomerList)

      function render(Component) {
        ReactDOM.render(
          <AppContainer>
            <Provider store={$ngRedux}>
              <Component />
            </Provider>
          </AppContainer>,
          document.getElementById('customer-list')
        )
      }

      if (module.hot) {
        module.hot.accept('./CustomerList', () => {
          const Next = require('./CustomerList').default
          render(Next)
        })
      }
    }],
    template: '<div id="customer-list"></div>'
  })
  .name;
