import dotenv from 'dotenv'
import cors from 'cors'
dotenv.config()

import express from 'express'
import * as path from 'path'
import * as fs from 'fs/promises'
import { createServer as createViteServer } from 'vite'
import type { ViteDevServer } from 'vite'
import type { State } from '../shared/types'

const port = Number(process.env.SERVER_PORT) || 3001
const pathToShared = path.resolve('../shared')
const clientPath = path.resolve('../client')
const isDev = process.env.NODE_ENV === 'development'

const data: State = {text: 'Текст с сервера'};
async function createServer() {
  const app = express()
  app.use(cors())

  let vite: ViteDevServer | undefined
  if (isDev) {
    vite = await createViteServer({
      server: { middlewareMode: true },
      root: clientPath,
      appType: 'custom',
    })

    app.use(vite.middlewares)
  }

  app.get('/api', (_, res) => {
    res.json('👋 Howdy from the server :)')
  })

  app.get('*', async (req, res, next) => {
    const url = req.originalUrl

    try {
      let render: (data: State) => Promise<string>
      let template: string
      if (vite) {
        // Получаем файл client/index.html который мы правили ранее
        template = await fs.readFile(
          path.resolve(clientPath, 'index.html'),
          'utf-8'
        )

        // Применяем встроенные HTML-преобразования vite и плагинов
        template = await vite.transformIndexHtml(url, template)

        // Загружаем модуль, который будет рендерить нам HTML-код
        render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render
      } else {
        template = await fs.readFile(
          path.join(pathToShared, 'dist/index.html'),
          'utf-8'
        )

        // Получаем путь до сбилдженого модуля клиента, чтобы не тащить средства сборки клиента на сервер
        const pathToServer = require.resolve(
          path.join(pathToShared, '/ssr-build/entry-server.cjs')
        )

        // Импортируем этот модуль и вызываем с инишл стейтом
        render = (await import(pathToServer)).render
      }

      // Получаем HTML-строку из JSX
      const appHtml = await render(data)

      // Заменяем наш комментарий на сгенерированную HTML-строку
      const html = template.replace(`<!--ssr-outlet-->`, appHtml).replace(
        `<!--ssr-initial-state-->`,
        `<script>window.APP_INITIAL_STATE = ${JSON.stringify(data)}</script>`
      )

      // Завершаем запрос и отдаем HTML-страницу
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      if (vite) {
        vite.ssrFixStacktrace(e as Error)
      }
      next(e)
    }
  })

  app.listen(port, () => {
    console.log(`  ➜ 🎸 Server is listening on port: ${port}`)
  })
}

createServer()
