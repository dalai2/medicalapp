// app.ts
import express from 'express';
import routes from './routes'; // Import the central routes file
import { connectDB } from './config/database';
import logger from './utils/logger';

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use((req, res, next) => {
  logger.info(`Solicitud recibida: ${req.method} ${req.url}`);
  next();
});

// Use the central router
app.use('/', routes);

export default app;