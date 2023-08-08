import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { reducer, State } from './store'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import './index.css'
import {routes} from './routes'

declare global {
  interface Window {
    APP_INITIAL_STATE: State
  }
}

const store = createStore(reducer, window.APP_INITIAL_STATE)
const router = createBrowserRouter(routes);

ReactDOM.hydrateRoot(
  document.getElementById('root') as HTMLElement,
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
)
