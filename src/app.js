import express, { response } from 'express';
import { config } from './config.js';
import globalErrorHandler from './middlewares/globalErrorHandler.js';
import logger from './middlewares/logger.js';

const app = express();
app.use(express.json());
//Logger Middleware
app.use(logger);

//Error Handler Middleware
app.use(globalErrorHandler);

function startServer() {
  const port = config.port || 3000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

export default startServer;
