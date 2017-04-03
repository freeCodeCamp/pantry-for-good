import React from 'react'
import {Provider} from 'react-redux'
import ReactDOM from 'react-dom'
import {AppContainer} from 'react-hot-loader'
import angular from 'angular';

import CustomerCreateSuccess from './CustomerCreateSuccess'

export default angular.module('customer')
  .component('customerCreateSuccess', {
    controller: ['$ngRedux', function($ngRedux) {
      render(CustomerCreateSuccess)

      function render(Component) {
        ReactDOM.render(
          <AppContainer>
            <Provider store={$ngRedux}>
              <Component />
            </Provider>
          </AppContainer>,
          document.getElementById('customer-create-success')
        )
      }

      if (module.hot) {
        module.hot.accept('./CustomerCreateSuccess', () => {
          const Next = require('./CustomerCreateSuccess').default
          render(Next)
        })
      }
    }],
    template: '<div id="customer-create-success"></div>'
  })
  .name;
