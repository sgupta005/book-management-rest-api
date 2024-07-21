import { config as conf } from 'dotenv';

conf();

const _config = {
  port: process.env.PORT,
  env: process.env.ENVIRONMENT,
  cookieSecret: process.env.COOKIE_SECRET,
  sessionSecret: process.env.SESSION_SECRET,
  mongodbUri: process.env.MONGODB_URI,
  dbName: process.env.DB_NAME,
};

export const config = Object.freeze(_config);
