import React from 'react'
import {Provider} from 'react-redux'
import ReactDOM from 'react-dom'
import {AppContainer} from 'react-hot-loader'
import angular from 'angular';

import Schedule from './Schedule'

export default angular.module('users')
  .component('schedules', {
    controller: function ($ngRedux) {
      render(Schedule)

      function render(Component) {
        ReactDOM.render(
          <AppContainer>
            <Provider store={$ngRedux}>
              <Component />
            </Provider>
          </AppContainer>,
          document.getElementById('schedule')
        )
      }

      if (module.hot) {
        module.hot.accept('./Schedule', () => {
          const Next = require('./Schedule').default
          render(Next)
        })
      }
    },
    template: '<div id="schedule"></div>'
  })
  .name
