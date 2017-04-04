import React from 'react'
import {Provider} from 'react-redux'
import ReactDOM from 'react-dom'
import {AppContainer} from 'react-hot-loader'
import angular from 'angular';

import PackingList from './PackingList'

export default angular.module('volunteer')
  .component('packingList', {
    controller: ['$ngRedux', function($ngRedux) {
      render(PackingList)

      function render(Component) {
        ReactDOM.render(
          <AppContainer>
            <Provider store={$ngRedux}>
              <Component />
            </Provider>
          </AppContainer>,
          document.getElementById('packing-list')
        )
      }

      if (module.hot) {
        module.hot.accept('./PackingList', () => {
          const Next = require('./PackingList').default
          render(Next)
        })
      }
    }],
    template: '<div id="packing-list"></div>'
  })
  .name;
