import {createStore, applyMiddleware, compose} from 'redux'
import {routerMiddleware as createRouterMiddleware} from 'react-router-redux'
import thunk from 'redux-thunk'

import apiMiddleware from './middleware/api'
import notifyMiddleware from './middleware/notify'
import reducer from './reducer'

/**
 * Create redux store
 * @param {History} history
 */
export default (history, socket) => {
  const routerMiddleware = createRouterMiddleware(history)
  const middleware = [thunk, routerMiddleware, apiMiddleware(socket), notifyMiddleware]

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

  const enhancers = composeEnhancers(applyMiddleware(...middleware))

  const store = createStore(reducer, enhancers)

  if(module.hot) {
    module.hot.accept('./reducer', () => {
      const nextReducer = require('./reducer').default
      store.replaceReducer(nextReducer)
    })
  }

  return store
}
