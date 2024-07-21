import mongoose from 'mongoose';
import { config } from './config.js';

async function connectDB() {
  try {
    await mongoose.connect(`${config.mongodbUri}/${config.dbName}`);
    console.log('MongoDB connnected successfully');
  } catch (err) {
    throw err;
  }
}

export default connectDB;
