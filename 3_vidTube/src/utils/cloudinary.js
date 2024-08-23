import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload an image
const uploadOnCloudinary = async localFilePath => {
  try {
    if (!localFilePath) return null;

    //upload file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto', // identifies the file type on its own
    });
    // file has been uploaded successfully
    // console.log("File is uploaded on cloudinary ", response.url);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    console.log('Cloudinary upload error', error);
    fs.unlinkSync(localFilePath); // unlinks or removes from server
    return null;
  }
};

//delete image

const deleteFromCloudinary = async publicId => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log('Deleted from cloudinary. PublicId: ', publicId);
  } catch (error) {
    console.log('Failed deleting image from cloudinary', error);
    return null;
  }
};

export {uploadOnCloudinary, deleteFromCloudinary};
