import express, { Express } from 'express';
import userRoutes from './routes/userRoutes';
import technologyRoutes from './routes/technologyRoutes';

function createApp(): Express {
  const app = express();

  app.use(express.json());
  app.use('/users', userRoutes);
  app.use('/technologies', technologyRoutes);

  return app;
}

export default createApp;
