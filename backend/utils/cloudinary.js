import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
console.log('Cloudinary API Key:', process.env.CLOUDINARY_API_KEY); // Debugging line to check if the API key is loaded correctly

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'marble-images', // folder in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

export { cloudinary, storage };
