import React from 'react'
import {Provider} from 'react-redux'
import ReactDOM from 'react-dom'
import {AppContainer} from 'react-hot-loader'
import angular from 'angular';

import VolunteerView from './VolunteerView'

export default angular.module('volunteer')
  .component('viewVolunteer', {
    controller: ['$ngRedux', function($ngRedux) {
      render(VolunteerView)

      function render(Component) {
        ReactDOM.render(
          <AppContainer>
            <Provider store={$ngRedux}>
              <Component />
            </Provider>
          </AppContainer>,
          document.getElementById('volunteer-view')
        )
      }

      if (module.hot) {
        module.hot.accept('./VolunteerView', () => {
          const Next = require('./VolunteerView').default
          render(Next)
        })
      }
    }],
    template: '<div id="volunteer-view"></div>'
  })
  .name;

