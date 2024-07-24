import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import CustomError from '../utils/CustomError.js';
import { config } from '../config.js';

cloudinary.config({
  cloud_name: config.cloudinaryCloudName,
  api_key: config.cloudinaryApiKey,
  api_secret: config.cloudinaryApiSecret,
});

async function uploadOnCloudinary(localFilePath) {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
    });
    if (response.url) fs.unlinkSync(localFilePath);
    return response.url;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    throw new CustomError(error);
  }
}

export default uploadOnCloudinary;
