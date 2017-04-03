import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {AppContainer} from 'react-hot-loader'
import angular from 'angular';

import FoodbankLogo from '../../common/components/FoodbankLogo'

const Home = () =>
  <section className="content-header">
    <div className="row text-center">
      <FoodbankLogo />
    </div>
  </section>

export default Home

export const old = angular.module('core')
  .component('home', {
    controller: function($ngRedux) {
      render(Home)

      function render(Component) {
        ReactDOM.render(
          <AppContainer>
            <Provider store={$ngRedux}>
              <Component />
            </Provider>
          </AppContainer>,
          document.getElementById('content-wrapper')
        )
      }

      if (module.hot) {
        module.hot.accept('./home', () => {
          const Next = require('./home').default
          render(Next)
        })
      }
    }
  })
  .name;
