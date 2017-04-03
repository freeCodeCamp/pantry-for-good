import React from 'react'
import {Provider, connect} from 'react-redux'
import ReactDOM from 'react-dom'
import {AppContainer} from 'react-hot-loader'
import angular from 'angular';

import CustomerView from './CustomerView'

export default angular.module('customer')
  .component('customerView', {
    controller: function($ngRedux, View) {
      render(CustomerView)

      function render(Component) {
        ReactDOM.render(
          <AppContainer>
            <Provider store={$ngRedux}>
              <Component />
            </Provider>
          </AppContainer>,
          document.getElementById('customer-view')
        )
      }

      if (module.hot) {
        module.hot.accept('./CustomerView', () => {
          const Next = require('./CustomerView').default
          render(Next)
        })
      }
    },
    template: '<div id="customer-view"></div>'
  })
  .name;
