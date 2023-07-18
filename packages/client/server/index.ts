import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import path from 'path'
import fs from 'fs/promises'
import { createServer as createViteServer } from 'vite'

const port = 80
const clientPath = path.join(__dirname, '..')
const isDev = process.env.NODE_ENV === 'development'

async function createServer() {
  const app = express()

  const vite = await createViteServer({
    server: { middlewareMode: true },
    root: clientPath,
    appType: 'custom',
  })

  app.use(vite.middlewares)

  app.get('*', async (req, res, next) => {
    const url = req.originalUrl

    try {
      // Получаем файл client/index.html который мы правили ранее
      let template = await fs.readFile(
        path.resolve(clientPath, 'index.html'),
        'utf-8'
      )

      // Применяем встроенные HTML-преобразования vite и плагинов
      template = await vite.transformIndexHtml(url, template)

      // Загружаем модуль, который будет рендерить нам HTML-код
      const { render } = await vite.ssrLoadModule(
        path.join(clientPath, 'src/entry-server.tsx')
      )

      // Получаем HTML-строку из JSX
      const appHtml = await render()

      // Заменяем наш комментарий на сгенерированную HTML-строку
      const html = template.replace(`<!--ssr-outlet-->`, appHtml)

      // Завершаем запрос и отдаем HTML-страницу
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      vite.ssrFixStacktrace(e as Error)
      next(e)
    }
  })

  app.listen(port, () => {
    console.log(`Client is listening on port: ${port}`)
  })
}

createServer()
