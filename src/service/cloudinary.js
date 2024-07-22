import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

async function uploadOnCloudinary(localFilePath) {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
    });
    console.log('File has been uploaded to cloudinary successfully');
    console.log(response.url);
    return response.url;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    return null;
  }
}

export default uploadOnCloudinary;
