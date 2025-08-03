import { Hono } from 'hono'

const app = new Hono()

app.use('*', async (c, next) => {
  console.log(`${c.req.method} ${c.req.url}`)
  await next()
})

app.onError((error, c) => {
  console.error(`[${new Date().toISOString()}] Error:`, error)
  return c.json({
    error: 'Internal Server Error',
    message: error.message,
    path: c.req.path,
    method: c.req.method
  }, 500)
})

app.get('/', async (c) => {
  return c.text('Hello Hono!')
})

export default app
