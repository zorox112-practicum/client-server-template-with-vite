import React from 'react'
import ReactDOM from 'react-dom/server'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import App from './App'
import './index.css'
import { reducer } from './store'
import { State } from '../../shared/types'

export const render = (appInitialState: State) => {
  const store = createStore(reducer, appInitialState)
  return ReactDOM.renderToString(
    <Provider store={store}>
      <App />
    </Provider>
  )
}
