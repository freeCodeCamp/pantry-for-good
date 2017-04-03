import React from 'react'
import {Provider} from 'react-redux'
import ReactDOM from 'react-dom'
import {AppContainer} from 'react-hot-loader'
import angular from 'angular';

import VolunteerCreate from './VolunteerCreate'

export default angular.module('volunteer')
  .component('createVolunteer', {
    controller: ['$ngRedux', function($ngRedux) {
      render(VolunteerCreate)

      function render(Component) {
        ReactDOM.render(
          <AppContainer>
            <Provider store={$ngRedux}>
              <Component />
            </Provider>
          </AppContainer>,
          document.getElementById('volunteer-create')
        )
      }

      if (module.hot) {
        module.hot.accept('./VolunteerCreate', () => {
          const Next = require('./VolunteerCreate').default
          render(Next)
        })
      }
    }],
    template: '<div id="volunteer-create"></div>'
  })
  .name;
