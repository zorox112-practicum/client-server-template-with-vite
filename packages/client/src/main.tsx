import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { reducer, State } from './store'
import App from './App'
import './index.css'

declare global {
  interface Window {
    APP_INITIAL_STATE: State
  }
}

const store = createStore(reducer, window.APP_INITIAL_STATE)

ReactDOM.hydrateRoot(
  document.getElementById('root') as HTMLElement,
  <Provider store={store}>
    <App />
  </Provider>
)
