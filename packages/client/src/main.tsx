import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import './index.css'
import { routes } from './routes'

const router = createBrowserRouter(routes)

ReactDOM.hydrateRoot(
  document.getElementById('root') as HTMLElement,
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
)
