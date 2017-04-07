import React from 'react'
import {Provider} from 'react-redux'
import ReactDOM from 'react-dom'
import {AppContainer} from 'react-hot-loader'
import angular from 'angular';

import Media from './Media'

export default angular.module('customer')
  .component('changeMedia', {
    controller: function($ngRedux) {
      render(Media)

      function render(Component) {
        ReactDOM.render(
          <AppContainer>
            <Provider store={$ngRedux}>
              <Component />
            </Provider>
          </AppContainer>,
          document.getElementById('change-media')
        )
      }

      if (module.hot) {
        module.hot.accept('./Media', () => {
          const Next = require('./Media').default
          render(Next)
        })
      }
    },
    template: '<div id="change-media"></div>'
  })
  .name;
