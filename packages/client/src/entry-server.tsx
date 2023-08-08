import React from 'react'
import ReactDOM from 'react-dom/server'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { Request as ExpressRequest } from 'express'
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router-dom/server'
import './index.css'
import { reducer, State } from './store'
import { routes } from './routes'
import { createFetchRequest } from '../server/requset'

export const render = async (appInitialState: State, req: ExpressRequest) => {
  const store = createStore(reducer, appInitialState)

  const { query, dataRoutes } = createStaticHandler(routes);
  const fetchRequest = createFetchRequest(req);
  const context = await query(fetchRequest);

  if (context instanceof Response) {
    throw context;
  }
  const router = createStaticRouter(dataRoutes, context);

  return ReactDOM.renderToString(
    <Provider store={store}>
      <StaticRouterProvider
        router={router}
        context={context}
      />
    </Provider>
  )
}
