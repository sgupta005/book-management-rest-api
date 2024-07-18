import { config as conf } from 'dotenv';

conf();

const _config = {
  port: process.env.PORT,
  env: 'development',
};

export const config = Object.freeze(_config);
