import React from 'react'
import {Provider, connect} from 'react-redux'
import ReactDOM from 'react-dom'
import {AppContainer} from 'react-hot-loader'
import angular from 'angular';

import CustomerEdit from './CustomerEdit'

export default angular.module('customer')
  .component('customerEdit', {
    controller: function($ngRedux) {
      render(CustomerEdit)

      function render(Component) {
        ReactDOM.render(
          <AppContainer>
            <Provider store={$ngRedux}>
              <Component />
            </Provider>
          </AppContainer>,
          document.getElementById('customer-edit')
        )
      }

      if (module.hot) {
        module.hot.accept('./CustomerEdit', () => {
          const Next = require('./CustomerEdit').default
          render(Next)
        })
      }
    },
    template: '<div id="customer-edit"></div>'
  })
  .name;
