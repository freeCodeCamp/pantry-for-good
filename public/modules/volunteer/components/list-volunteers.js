import React from 'react'
import {Provider} from 'react-redux'
import ReactDOM from 'react-dom'
import {AppContainer} from 'react-hot-loader'
import angular from 'angular';

import VolunteerList from './VolunteerList'

export default angular.module('volunteer')
  .component('listVolunteers', {
    controller: ['$ngRedux', function($ngRedux) {
      render(VolunteerList)

      function render(Component) {
        ReactDOM.render(
          <AppContainer>
            <Provider store={$ngRedux}>
              <Component />
            </Provider>
          </AppContainer>,
          document.getElementById('volunteer-list')
        )
      }

      if (module.hot) {
        module.hot.accept('./VolunteerList', () => {
          const Next = require('./VolunteerList').default
          render(Next)
        })
      }
    }],
    template: '<div id="volunteer-list"></div>'
  })
  .name;

