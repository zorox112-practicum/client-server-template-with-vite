import React from 'react'
import ReactDOM from 'react-dom/server'
import { Provider } from 'react-redux'
import { Request as ExpressRequest } from 'express'
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from 'react-router-dom/server'
import { matchRoutes } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'

import { setPageHasBeenInitializedOnServer } from './slices/ssrSlice'
import { createFetchRequest } from './requset'
import { reducer } from './store'
import { routes } from './routes'
import './index.css'

export const render = async (req: ExpressRequest) => {
  const { query, dataRoutes } = createStaticHandler(routes)
  const fetchRequest = createFetchRequest(req)
  const context = await query(fetchRequest)

  if (context instanceof Response) {
    throw context
  }

  const store = configureStore({
    reducer,
  })

  const origin = `${req.protocol}://${req.get('host')}`

  const url = new URL(req.originalUrl || req.url, origin)

  const foundRoutes = matchRoutes(routes, url)
  if (!foundRoutes) {
    throw new Error('Страница не найдена!')
  }
  const [
    {
      route: { fetchData },
    },
  ] = foundRoutes
  store.dispatch(setPageHasBeenInitializedOnServer(true))
  try {
    await fetchData({ dispatch: store.dispatch, state: store.getState() })
  } catch (e) {
    console.log('init page with error', e)
  }

  const router = createStaticRouter(dataRoutes, context)

  return {
    html: ReactDOM.renderToString(
      <Provider store={store}>
        <StaticRouterProvider router={router} context={context} />
      </Provider>
    ),
    initialState: store.getState(),
  }
}
