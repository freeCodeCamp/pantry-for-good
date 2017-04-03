import React from 'react'
import {Provider} from 'react-redux'
import ReactDOM from 'react-dom'
import {AppContainer} from 'react-hot-loader'
import angular from 'angular';

import VolunteerCreateSuccess from './VolunteerCreateSuccess'

export default angular.module('volunteer')
  .component('createVolunteerSuccess', {
    controller: ['$ngRedux', function($ngRedux) {
      render(VolunteerCreateSuccess)

      function render(Component) {
        ReactDOM.render(
          <AppContainer>
            <Provider store={$ngRedux}>
              <Component />
            </Provider>
          </AppContainer>,
          document.getElementById('volunteer-create-success')
        )
      }

      if (module.hot) {
        module.hot.accept('./VolunteerCreateSuccess', () => {
          const Next = require('./VolunteerCreateSuccess').default
          render(Next)
        })
      }
    }],
    template: '<div id="volunteer-create-success"></div>'
  })
  .name;
