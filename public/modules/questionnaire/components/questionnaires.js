import React from 'react'
import {Provider} from 'react-redux'
import ReactDOM from 'react-dom'
import {AppContainer} from 'react-hot-loader'
import angular from 'angular';

import Questionnaire from './Questionnaire'

export default angular.module('users')
  .component('questionnaires', {
    controller: function ($ngRedux) {
      render(Questionnaire)

      function render(Component) {
        ReactDOM.render(
          <AppContainer>
            <Provider store={$ngRedux}>
              <Component />
            </Provider>
          </AppContainer>,
          document.getElementById('questionnaire')
        )
      }

      if (module.hot) {
        module.hot.accept('./Questionnaire', () => {
          const Next = require('./Questionnaire').default
          render(Next)
        })
      }
    },
    template: '<div id="questionnaire"></div>'
  })
  .name
