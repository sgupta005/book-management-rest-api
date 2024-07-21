import express, { response } from 'express';
import { config } from './config.js';
import globalErrorHandler from './middlewares/globalErrorHandler.js';
import logger from './middlewares/logger.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import CustomError from './utils/CustomError.js';

const app = express();
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  })
);
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());

//Logger Middleware
app.use(logger);

//Default Route
app.all('*', (req, res, next) => {
  const err = new CustomError(
    `Can't find ${req.originalUrl} route on server`,
    404
  );
  next(err);
});

//Error Handler Middleware
app.use(globalErrorHandler);

function startServer() {
  const port = config.port || 3000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

export default startServer;
