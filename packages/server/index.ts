import dotenv from 'dotenv'
import cors from 'cors'
dotenv.config()

import express from 'express'
import * as path from 'path'
import * as fs from 'fs'
import { createServer as createViteServer } from 'vite'

const port = Number(process.env.SERVER_PORT) || 3001
const clientPath = path.join(__dirname, '../client')

async function createServer() {
  const app = express()
  app.use(cors())

  const vite = await createViteServer({
    server: { middlewareMode: true },
    root: clientPath,
    appType: 'custom',
  })

  app.use(vite.middlewares)

  app.get('/api', (_, res) => {
    res.json('👋 Howdy from the server :)')
  })

  app.get('*', async (req, res, next) => {
    const url = req.originalUrl

    try {
      // Получаем файл client/index.html который мы правили ранее
      let template = fs.readFileSync(
        path.resolve(clientPath, 'index.html'),
        'utf-8'
      )

      // Применяем встроенные HTML-преобразования vite и плагинов
      template = await vite.transformIndexHtml(url, template)

      // Загружаем модуль, который будет рендерить нам HTML-код
      const { render } = await vite.ssrLoadModule('/src/entry-server.tsx')

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
    console.log(`  ➜ 🎸 Server is listening on port: ${port}`)
  })
}

createServer()
