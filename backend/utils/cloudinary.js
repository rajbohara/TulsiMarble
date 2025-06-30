import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: 'dashxjxtx',
  api_key: '133922838997659',
  api_secret: 'ZsrigqgGjTZYAQm_FIn_mieeSTQ',
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'marble-images', // folder in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

export { cloudinary, storage };
