import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import userRouter from './routes/user.routes';
import adminRouter from './routes/admin.routes';
import { swaggerUI } from '@hono/swagger-ui';
import openApiSpec from './swagger.json';

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    ARGON2_SECRET: string;
    JWT_SECRET: string;
    NPM_PACKAGE_VERSION: string;
  }
}>();

app.onError((error, c) => {
  console.error(`[${new Date().toISOString()}] Error:`, error);
  return c.json({
    error: 'Internal Server Error',
    message: error.message,
    path: c.req.path,
    method: c.req.method
  }, 500);
});

app.get('/swagger.json', (c) => c.json(openApiSpec));

app.use('/docs', swaggerUI({ url: '/swagger.json' }));

app.get('/health', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL
  }).$extends(withAccelerate());

  if (prisma) await prisma.$queryRaw`SELECT 1`;
  else throw new Error('Database connection is not established');

  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'Server is running and database connection is healthy',
    database: prisma ? 'connected' : 'not connected',
    version: c.env.NPM_PACKAGE_VERSION || 'unknown'
  });
});

app.get('/', (c) => c.text('Hello Hono!'));

app.route('/user', userRouter);
app.route('/admin', adminRouter);

export default app;
