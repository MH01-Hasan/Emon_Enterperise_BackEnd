
import { v2 as cloudinary } from 'cloudinary';
import config from '../config';

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

type MediaId = string;
type CloudinaryResponse = unknown;

const cloudinaryDestroy = (mediaId: MediaId): Promise<CloudinaryResponse> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(
      mediaId,
      (error: unknown, result: CloudinaryResponse) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};

export { cloudinaryDestroy };

