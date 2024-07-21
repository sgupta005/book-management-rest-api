import startServer from './app.js';
import connectDB from './db.js';

connectDB()
  .then(() => startServer())
  .catch((err) => console.error('MONGODB CONNECTION FAILED: ', err));
