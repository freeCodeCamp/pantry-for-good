import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {AppContainer} from 'react-hot-loader'
import createHistory from 'history/createBrowserHistory'

import createStore from './store'
import {setUser} from './modules/users/reducer'
import {loadMedia} from './modules/settings/reducers/media'
import {loadSettings} from './modules/settings/reducers/settings'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'font-awesome/css/font-awesome.css'
import 'admin-lte/dist/css/AdminLTE.min.css'
import 'admin-lte/dist/css/skins/skin-blue.min.css'
import 'jquery'
import 'admin-lte/plugins/slimScroll/jquery.slimscroll'
import 'admin-lte/plugins/fastclick/fastclick'

import './application.css'
import './modules/core/css/core.css'

import Router from './Router'

//disable redbox
delete AppContainer.prototype.unstable_handleError

const history = createHistory({})
const store = createStore(history)

const root = document.getElementById('app')

function render(Component) {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <Component history={history} />
      </Provider>
    </AppContainer>,
    root
  )

  // for admin-lte
  window.dispatchEvent(new Event('resize'))
}

if (module.hot) {
  module.hot.accept('./Router', () => {
    const Next = require('./Router').default
    render(Next)
  })
}


store.dispatch(loadMedia())
store.dispatch(loadSettings())

fetch('/api/users/me', {credentials: 'same-origin'})
  .then(res =>
    res.json().then(user => {
      store.dispatch(setUser(user))
      render(Router)
    }))
