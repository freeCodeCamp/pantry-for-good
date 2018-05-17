import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {AppContainer} from 'react-hot-loader'
import createHistory from 'history/createBrowserHistory'
import io from 'socket.io-client'

import createStore from './store'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'font-awesome/css/font-awesome.css'
import 'admin-lte/dist/css/AdminLTE.min.css'
import 'admin-lte/dist/css/skins/skin-blue.min.css'
import 'jquery'
import 'react-s-alert/dist/s-alert-default.css'
import 'react-s-alert/dist/s-alert-css-effects/flip.css'

import './application.css'
import './modules/core/css/core.css'

import Application from './Application'

//disable redbox
delete AppContainer.prototype.unstable_handleError

const history = createHistory({})
const socket = process.env.NODE_ENV === 'production' ?
  io() : io('http://localhost:3000')

const store = createStore(history, socket)

socket.on('action', store.dispatch)

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
}

if (module.hot) {
  module.hot.accept('./Application', () => {
    const Next = require('./Application').default
    render(Next)
  })
}

render(Application)
