 
 import { v2 as cloudinary } from 'cloudinary';
 import streamifier from "streamifier";



 cloudinary.config({ 
        cloud_name: 'domgidptm', 
        api_key: '778121423134461', 
        api_secret: process.env.CLOUDNERY_SECRET_KEY 
    });

export const uploadVideoToCloudinary = async (
  buffer: Buffer
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "video",
        folder: "instagram_videos",
      },
      (error, result) => {
        if (error) return reject(error);

        resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};