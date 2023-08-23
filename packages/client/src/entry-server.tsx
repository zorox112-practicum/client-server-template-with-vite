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
import {
  createFetchRequest,
  createContext,
  createUrl,
} from './entry-server.utils'
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

  const url = createUrl(req)

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
    await fetchData({
      dispatch: store.dispatch,
      state: store.getState(),
      ctx: createContext(req),
    })
  } catch (e) {
    console.log('Инициализация страницы произошла с ошибкой', e)
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
