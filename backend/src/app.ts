import express from 'express';
import cors from 'cors';
import todosRouter from './routes/todos';
import categoriesRouter from './routes/categories';

export function createApp() {
  const app = express();

  app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
  app.use(express.json());

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));
  app.use('/todos', todosRouter);
  app.use('/categories', categoriesRouter);

  return app;
}
