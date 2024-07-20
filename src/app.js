import express from 'express';
import { config } from './config.js';
import globalErrorHandler from './middlewares/globalErrorHandler.js';
import logger from './middlewares/logger.js';
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(logger);

app.get('/', (request, response, next) => {
  response.cookie('hello', 'world', { maxAge: 60000 * 60 });
  response.status(200).json({ hello: 'worldsdfasfas' });
});

app.use(globalErrorHandler);

function startServer() {
  const port = config.port || 3000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

export default startServer;
