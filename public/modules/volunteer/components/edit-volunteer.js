import React from 'react'
import {Provider} from 'react-redux'
import ReactDOM from 'react-dom'
import {AppContainer} from 'react-hot-loader'
import angular from 'angular';

import VolunteerEdit from './VolunteerEdit'

export default angular.module('volunteer')
  .component('editVolunteer', {
    controller: ['$ngRedux', function($ngRedux) {
      render(VolunteerEdit)

      function render(Component) {
        ReactDOM.render(
          <AppContainer>
            <Provider store={$ngRedux}>
              <Component />
            </Provider>
          </AppContainer>,
          document.getElementById('volunteer-edit')
        )
      }

      if (module.hot) {
        module.hot.accept('./VolunteerEdit', () => {
          const Next = require('./VolunteerEdit').default
          render(Next)
        })
      }
    }],
    template: '<div id="volunteer-edit"></div>'
  })
  .name;
