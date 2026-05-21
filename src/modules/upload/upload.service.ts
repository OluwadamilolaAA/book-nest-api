import { UploadApiResponse } from "cloudinary";
import streamifier from "streamifier";
import cloudinary from "../../config/cloudinary";
import { BadRequestError } from "../../common/errors";

const uploadImage = async (file?: Express.Multer.File) => {
  if (!file) {
    throw new BadRequestError("Please upload an image");
  }

  const result = await new Promise<UploadApiResponse>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "booknest/books",
        resource_type: "image",
      },
      (error, result) => {
        if (error || !result) {
          return reject(error);
        }

        resolve(result);
      },
    );

    uploadStream.end(file.buffer);
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
};

export { uploadImage };