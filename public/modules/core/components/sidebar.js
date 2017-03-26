import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {AppContainer} from 'react-hot-loader'
import angular from 'angular';

import Sidebar from './sidebar/Sidebar'

export const old = angular.module('core')
  .component('sidebar', {
    controller: function($ngRedux) {
      render(Sidebar)

      function render(Component) {
        ReactDOM.render(
          <AppContainer>
            <Provider store={$ngRedux}>
              <Component />
            </Provider>
          </AppContainer>,
          document.getElementById('sidebar')
        )
      }

      if (module.hot) {
        module.hot.accept('./sidebar/Sidebar', () => {
          const Next = require('./sidebar/Sidebar').default
          render(Next)
        })
      }
    }
  })
  .name;
