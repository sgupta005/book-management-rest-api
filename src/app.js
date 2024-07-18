import express from 'express';
import { config } from './config.js';
import globalErrorHandler from './middlewares/globalErrorHandler.js';

const app = express();
app.use(express.json());
app.use(globalErrorHandler);

function startServer() {
  const port = config.port || 3000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

export default startServer;
